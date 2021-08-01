function initialize_level(level) {
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
    map_count = maps.length;

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


}
