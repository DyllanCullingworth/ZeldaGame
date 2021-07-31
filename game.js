

// options
kaboom({
    global: true, // import all kaboom functions to global namespace
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor: [0, 0, 0, 1]
});


const MOVE_SPEED = 120;
const SLICER_SPEED = 100;
const SKELETOR_SPEED = 60;

https://imgur.com/
// Set the root folder for finding images
loadRoot('https://i.imgur.com/');
// Store images on something like IMGUR and link them below ( 48px x 48px);
loadSprite('link-going-left', 'wC5TDtK.png');
loadSprite('link-going-right', 'DVtlQIP.png');
loadSprite('link-going-down', 'rRSx6eT.png');
loadSprite('link-going-up', 'JJTxGTC.png');


loadSprite('top-left-wall', '3au0D3U.png');
loadSprite('top-wall', 'UJgz38b.png');
loadSprite('top-right-wall', 'AVTmn1C.jpg');
loadSprite('right-wall', '8w2KWFU.png');
loadSprite('bottom-right-wall', 'fVMAdwe.png');
loadSprite('bottom-wall', 'Mr152Qh.png');
loadSprite('bottom-left-wall', 'uBl4QPz.png');
loadSprite('left-wall', 'S6bTFAe.png');

loadSprite('top-door', 'yoV9FvD.png');
loadSprite('left-door', '5RHv1To.png');
loadSprite('stairs', 'jwJFfQk.png');
loadSprite('sink-hole', 'K2FOTEi.png');

loadSprite('bg', 'bxbkG4V.png');
loadSprite('grass', 'AVTmn1C.png');

loadSprite('fire-pot', 'd47zzrJ.png');
loadSprite('lanterns', '3KBXSaT.png');

loadSprite('slicer', 'qf0EPy5.png');
loadSprite('skeletor', '1wbC3JU.png');

loadSprite('kaboom', 'u84kCQG.png');




// uBl4QPz
// qf0EPy5
// jwJFfQk
// JJTxGTC
// d47zzrJ
// UJgz38b
// sK5gxre
// K2FOTEi
// DVtlQIP
// 5RHv1To
// 3KBXSaT
// NdSjd4H
// bxbkG4V
// Mr152Qh
// wC5TDtK
// yoV9FvD
// u84kCQG

// create a scene
scene('game', ({ level, score, health }) => {
    //      obj collides with player
    layers(['bg', 'obj', 'ui'], 'obj')

    // grid = 10x9
    const maps = [
        [
            'qww)ww^wwe',
            'a        d',
            'a      * d',
            'a    (   d',
            '%        d',
            'a    (   d',
            'a   *    d',
            'a        d',
            'zxx)xx)xxc',
        ],
        [
            'qwwwwwwwwe',
            'a        d',
            ')        )',
            'a        d',
            'a        d',
            'a     $  d',
            ')    }   )',
            'a        d',
            'zxxxxxxxxc',
        ]

    ]

    const levelConfig = {
        width: 48,
        height: 48,
        //walls
        // qwwwe
        // a   d
        // zxxxc
        'q': [sprite('top-left-wall'), solid(), 'wall'],
        'w': [sprite('top-wall'), solid(), 'wall'],
        'e': [sprite('top-right-wall'), solid(), 'wall'],
        'd': [sprite('right-wall'), solid(), 'wall'],
        'c': [sprite('bottom-right-wall'), solid(), 'wall'],
        'x': [sprite('bottom-wall'), solid(), 'wall'],
        'z': [sprite('bottom-left-wall'), solid(), 'wall'],
        'a': [sprite('left-wall'), solid(), 'wall'],

        ')': [sprite('lanterns'), solid()],
        '(': [sprite('fire-pot'), solid()],

        '%': [sprite('left-door'), solid()],
        '^': [sprite('top-door'), 'next-level'],
        '$': [sprite('stairs'), 'next-level'],

        '*': [sprite('slicer'), 'slicer', 'dangerous', { dir: -1, dmg: 1 }],
        '}': [sprite('skeletor'), 'skeletor', 'dangerous', { dir: -1, timer: 0, dmg: 2 }],

    }

    addLevel(maps[level - 1], levelConfig);

    add([sprite('bg'), layer('bg')]); // add bg sprite to bg layer








    // Player ======
    const player = add([
        sprite('link-going-right'),
        health(5),
        pos(5, 190),
        {
            //right by default
            dir: vec2(1, 0),
            immune: false
        },
    ])

    player.action(() => {
        player.resolve()
    })

    player.overlaps('next-level', () => {
        go("game", {
            level: level == maps.length ? 1 : (level + 1), // loop through levels
            score: scoreLabel.value,
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


    function immune(obj, time) {
        if (obj.immune == false) {
            obj.immune = true;
            wait(time, () => {
                obj.immune = false;
            })
        }
    }


    // Player Movement =======
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



    function spawnKaboom(p) {
        const obj = add([sprite('kaboom'), pos(p), 'kaboom'])
        wait(0.2, () => {
            destroy(obj);
        })
    }

    keyPress('space', () => {
        spawnKaboom(player.pos.add(player.dir.scale(48)));
    })

    collides('kaboom', 'skeletor', (_k, s) => {
        camShake(4)
        destroy(s);
        scoreLabel.value++;
        scoreLabel.text = scoreLabel.value;
    })

    function health(hp) {
        return {
            // comp id (if not it'll be treated like custom fields on the game object)
            id: "health",
            // comp dependencies (will throw if the host object doesn't contain these components)
            require: [],
            // custom behaviors
            hurt(n) {
                if (!this.immune) {
                    hp -= n ?? 1;
                    // trigger custom events
                    this.trigger("hurt");
                    if (hp <= 0) {
                        this.trigger("death");
                    }
                }

            },
            heal(n) {
                hp += n ?? 1;
                this.trigger("heal");
            },
            hp() {
                return hp;
            },
        };
    }



    // UI ======
    const scoreLabel = add([
        text('0'),
        pos(400, 450),
        layer('ui'),
        {
            value: score
        },
        scale(2),
    ])

    add([
        text('level: ' + parseInt(level)),
        pos(400, 480),
        scale(2)
    ])


    const healthBar = add([
        text('Health:' + player.hp()),
        pos(0, 450),
        layer('ui'),
        scale(2)
    ])







    // NPC Movement ========
    action('slicer', (s) => {
        s.move(s.dir * SLICER_SPEED, 0);
    })

    action('skeletor', (s) => {
        s.move(0, s.dir * SKELETOR_SPEED);
        s.timer -= dt()
        if (s.timer <= 0) {
            s.dir = -s.dir;
            s.timer = rand(5);
        }
    })

    collides('dangerous', 'wall', (d) => {
        d.dir = -d.dir;
    })

}); // game scene

scene('lose', ({ score }) => {
    add([
        text(score, 32),
        // origin('center'),
        pos(width() / 2, height() / 2)
    ])
});

start('game', { level: 1, score: 0 });