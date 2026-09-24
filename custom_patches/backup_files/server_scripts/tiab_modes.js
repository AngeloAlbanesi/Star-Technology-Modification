const TIAB_ITEM_ID = 'tiab:time_in_a_bottle';
const TIAB_MODE_KEY = 'starTechnologyTiabMode';
const TIAB_MODE_NAMES = ['Singola', 'Area 3×3', 'Area 7×7', 'Shapeless'];
const TIAB_SHIFT_RELEASE_TICKS = 8;
const TIAB_SERVER_PLAYER = Java.loadClass('net.minecraft.server.level.ServerPlayer');
const GT_MACHINE_BLOCK_ENTITY = Java.loadClass('com.gregtechceu.gtceu.api.blockentity.MetaMachineBlockEntity');
const TIAB_NEIGHBORS = [
    [1, 0, 0], [-1, 0, 0],
    [0, 1, 0], [0, -1, 0],
    [0, 0, 1], [0, 0, -1]
];
let tiabNativeApi = null;
let tiabApiAccessFailed = false;
const tiabBlockClickLocks = new Set();
const tiabShiftReleaseTicks = new Map();

function getTiabMode(player) {
    const savedMode = player.persistentData.getInt(TIAB_MODE_KEY);
    return savedMode >= 0 && savedMode < TIAB_MODE_NAMES.length ? savedMode : 0;
}

function getTiabNativeApi(item) {
    if (tiabNativeApi !== null) return tiabNativeApi;
    if (tiabApiAccessFailed) return null;

    var apiField;
    try {
        apiField = item.getClass().getSuperclass().getDeclaredField('API');
        apiField.setAccessible(true);
        tiabNativeApi = apiField.get(null);
    } catch (error) {
        tiabApiAccessFailed = true;
        console.error(`Tiab modes: impossibile accedere all'API Tiab: ${error}`);
    }

    return tiabNativeApi;
}

function getTiabTargetKind(level, position) {
    if (!level.hasChunkAt(position)) return null;

    const state = level.getBlockState(position);
    const blockEntity = level.getBlockEntity(position);
    if (blockEntity === null && !state.isRandomlyTicking()) return null;

    if (blockEntity instanceof GT_MACHINE_BLOCK_ENTITY) {
        return {
            block: state.getBlock(),
            machineDefinition: blockEntity.getMetaMachine().getDefinition().getId(),
            blockEntityType: null
        };
    }

    return {
        block: state.getBlock(),
        machineDefinition: null,
        blockEntityType: blockEntity === null ? null : blockEntity.getType()
    };
}

function isTiabCompatible(level, position, targetKind) {
    if (!level.hasChunkAt(position)) return false;

    const state = level.getBlockState(position);
    if (!state.getBlock().equals(targetKind.block)) return false;

    const blockEntity = level.getBlockEntity(position);
    if (targetKind.machineDefinition !== null) {
        return blockEntity instanceof GT_MACHINE_BLOCK_ENTITY &&
            blockEntity.getMetaMachine().getDefinition().getId().equals(targetKind.machineDefinition);
    }

    if (targetKind.blockEntityType !== null) {
        return blockEntity !== null && blockEntity.getType().equals(targetKind.blockEntityType);
    }

    return blockEntity === null && state.isRandomlyTicking();
}

function collectTiabArea(level, center, targetKind, radius) {
    const targets = [center];

    for (var xOffset = -radius; xOffset <= radius; xOffset++) {
        for (var zOffset = -radius; zOffset <= radius; zOffset++) {
            if (xOffset === 0 && zOffset === 0) continue;
            var position = center.offset(xOffset, 0, zOffset);
            if (isTiabCompatible(level, position, targetKind)) targets.push(position);
        }
    }

    return targets;
}

function collectTiabConnected(level, center, targetKind) {
    const targets = [center];
    const visited = new Set([`${center.getX()},${center.getY()},${center.getZ()}`]);

    for (var currentIndex = 0; currentIndex < targets.length && targets.length < 64; currentIndex++) {
        var current = targets[currentIndex];

        for (var directionIndex = 0; directionIndex < TIAB_NEIGHBORS.length; directionIndex++) {
            var offsets = TIAB_NEIGHBORS[directionIndex];
            var neighbor = current.offset(offsets[0], offsets[1], offsets[2]);
            var coordinate = `${neighbor.getX()},${neighbor.getY()},${neighbor.getZ()}`;
            if (visited.has(coordinate)) continue;
            visited.add(coordinate);

            if (!isTiabCompatible(level, neighbor, targetKind)) continue;
            targets.push(neighbor);
            if (targets.length === 64) break;
        }
    }

    return targets;
}

PlayerEvents.tick(event => {
    const player = event.player;
    if (!(player instanceof TIAB_SERVER_PLAYER)) return;

    const playerId = String(player.uuid);
    if (!tiabBlockClickLocks.has(playerId)) return;
    if (player.isShiftKeyDown()) {
        tiabShiftReleaseTicks.delete(playerId);
        return;
    }

    const releaseTicks = (tiabShiftReleaseTicks.get(playerId) || 0) + 1;
    if (releaseTicks >= TIAB_SHIFT_RELEASE_TICKS) {
        tiabBlockClickLocks.delete(playerId);
        tiabShiftReleaseTicks.delete(playerId);
        return;
    }

    tiabShiftReleaseTicks.set(playerId, releaseTicks);
});

PlayerEvents.loggedOut(event => {
    const playerId = String(event.player.uuid);
    tiabBlockClickLocks.delete(playerId);
    tiabShiftReleaseTicks.delete(playerId);
});

ItemEvents.rightClicked(TIAB_ITEM_ID, event => {
    const player = event.player;
    if (!(player instanceof TIAB_SERVER_PLAYER)) return;
    if (!player.isShiftKeyDown()) return;

    const playerId = String(player.uuid);
    if (tiabBlockClickLocks.has(playerId)) return;

    if (String(event.target.type) !== 'MISS') return;

    var fullRayTrace = null;
    try {
        fullRayTrace = player.rayTrace(5.5, false);
    } catch (e) {
        fullRayTrace = event.target;
    }
    if (fullRayTrace && String(fullRayTrace.type) !== 'MISS') return;

    const nextMode = (getTiabMode(player) + 1) % TIAB_MODE_NAMES.length;
    player.persistentData.putInt(TIAB_MODE_KEY, nextMode);
    player.tell(`Tiab: modalità ${TIAB_MODE_NAMES[nextMode]}`);
    event.success();
});

BlockEvents.rightClicked(event => {
    const player = event.player;
    if (!(player instanceof TIAB_SERVER_PLAYER)) return;
    if (event.item.id !== TIAB_ITEM_ID) return;

    if (player.isShiftKeyDown()) {
        const playerId = String(player.uuid);
        tiabBlockClickLocks.add(playerId);
        tiabShiftReleaseTicks.delete(playerId);
    }

    const mode = getTiabMode(player);
    if (mode === 0) return;

    const level = event.block.minecraftLevel;
    const center = event.block.pos;
    const targetKind = getTiabTargetKind(level, center);
    if (targetKind === null) return;

    const item = event.item.getItem();
    const nativeApi = getTiabNativeApi(item);
    if (nativeApi === null || !nativeApi.canUse()) return;

    const targets = mode === 1
        ? collectTiabArea(level, center, targetKind, 1)
        : mode === 2
            ? collectTiabArea(level, center, targetKind, 3)
            : collectTiabConnected(level, center, targetKind);

    for (var targetIdx = 0; targetIdx < targets.length; targetIdx++) {
        var position = targets[targetIdx];
        if (!player.isCreative() && nativeApi.getStoredTime(event.item) < nativeApi.getEnergyCost(1)) break;
        item.accelerateBlock(nativeApi, event.item, player, level, position);
    }

    event.success();
});
