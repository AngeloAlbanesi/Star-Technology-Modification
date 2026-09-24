const PLAYER_UUID = '215b9bc2-963d-4b38-b7cb-87403286911a';
const MOVEMENT_SPEED = 0.3;

PlayerEvents.loggedIn(event => {
    if (event.player.uuid.toString() !== PLAYER_UUID) {
        return;
    }

    event.server.runCommandSilent(
        `attribute ${event.player.username} minecraft:generic.movement_speed base set ${MOVEMENT_SPEED}`
    );
});
