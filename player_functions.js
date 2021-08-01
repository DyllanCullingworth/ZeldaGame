


function initialize_player(level, score, hp) {
    const player = add([
        sprite('link-going-right'),
        pos(5, 190),
        health(parseInt(hp)),
        {
            //right by default
            dir: vec2(1, 0),
            immune: false,
        },
    ])

    add([
        text('Health:'),
        pos(0, 450),
        scale(2)
    ])

    const healthBar = add([
        text(player.hp()),
        pos(120, 450),
        layer('ui'),
        scale(2)
    ])

    const scoreLabel = add([
        text('0'),
        pos(350, 450),
        layer('ui'),
        {
            value: score
        },
        scale(2),
    ])

    add([
        text('level: ' + parseInt(level)),
        pos(350, 480),
        layer('ui'),
        scale(2)
    ])

    scoreLabel.text = scoreLabel.value;
    healthBar.text = player.hp();

    return {
        player,
        healthBar,
        scoreLabel
    }

}



function player_events(player, healthBar, scoreLabel, level, _score) {
    player.action(() => {
        player.resolve()
    })

    player.overlaps('next-level', () => {
        go("game", {
            level: level == map_count ? 1 : (level + 1), // loop through levels
            score: scoreLabel.value,
            hp: player.hp()
        })
    })

    player.overlaps('dangerous', (obj) => {
        player.hurt(obj.dmg);
    })

    player.on("hurt", () => {
        healthBar.text = player.hp();
        immune(player, 1);
    })

    player.on("death", () => {
        go("lose", { score: scoreLabel.value })
    })
}



function player_movements(player) {
    keyDown('left', () => {
        player.changeSprite('link-going-left');
        player.move(-MOVE_SPEED, 0);
        player.dir = vec2(-1, 0);
    })

    keyDown('right', () => {
        player.changeSprite('link-going-right');
        player.move(MOVE_SPEED, 0);
        player.dir = vec2(1, 0);
    })

    keyDown('up', () => {
        player.changeSprite('link-going-up');
        player.move(0, -MOVE_SPEED);
        player.dir = vec2(0, -1);
    })

    keyDown('down', () => {
        player.changeSprite('link-going-down');
        player.move(0, MOVE_SPEED);
        player.dir = vec2(0, 1);
    })
}

function player_attacks(player) {
    keyPress('space', () => {
        spawnKaboom(player.pos.add(player.dir.scale(48)));
    })
}



function spawnKaboom(p) {
    const obj = add([sprite('kaboom'), pos(p), 'kaboom'])
    wait(0.2, () => {
        destroy(obj);
    })
}