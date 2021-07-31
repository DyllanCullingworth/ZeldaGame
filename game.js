

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


// Set the root folder for finding images
loadRoot('https://i.imgur.com/')
// Store images on something like IMGUR and link them below ( 48px x 48px);
loadSprite('link-going-left', '1Xq9biB.png')
loadSprite('link-going-right', 'yZIb8O2.png')
loadSprite('link-going-down', 'tVtlP6y.png')
loadSprite('link-going-up', 'UkV0we0.png')
loadSprite('left-wall', 'rfDoaa1.png')
loadSprite('top-wall', 'QA257Bj.png')
loadSprite('bottom-wall', 'vWJWmvb.png')
loadSprite('right-wall', 'SmHhgUn.png')
loadSprite('bottom-left-wall', 'awnTfNC.png')
loadSprite('bottom-right-wall', '84oyTFy.png')
loadSprite('top-left-wall', 'xlpUxIm.png')
loadSprite('top-right-wall', 'z0OmBd1.jpg')
loadSprite('top-door', 'U9nre4n.png')
loadSprite('fire-pot', 'I7xSp7w.png')
loadSprite('left-door', 'okdJNls.png')
loadSprite('lanterns', 'wiSiY09.png')
loadSprite('slicer', 'c6JFi5Z.png')
loadSprite('skeletor', 'Ei1VnX8.png')
loadSprite('kaboom', 'o9WizfI.png')
loadSprite('stairs', 'VghkL08.png')
loadSprite('bg', 'u4DVsx6.png')

// create a scene
scene('game', ({ level, score }) => {
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

        '*': [sprite('slicer'), 'slicer', 'dangerous', { dir: -1 }],
        '}': [sprite('skeletor'), 'skeletor', 'dangerous', { dir: -1, timer: 0 }],

    }

    addLevel(maps[level - 1], levelConfig);

    add([sprite('bg'), layer('bg')]); // add bg sprite to bg layer



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




    // Player ======
    const player = add([
        sprite('link-going-right'),
        pos(5, 190),
        {
            //right by default
            dir: vec2(1, 0)
        }
    ])

    player.action(() => {
        player.resolve()
    })

    player.overlaps('next-level', () => {
        go("game", {
            level: level == maps.length ? 1 : (level + 1), // loop through levels
            score: scoreLabel.value
        })
    })

    player.overlaps('dangerous', () => {
        go("lose", { score: scoreLabel.value })
    })


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