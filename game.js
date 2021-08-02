

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


// create a scene
scene('game', ({ level, score, hp }) => {

    initialize_level(level);

    const playerObjects = initialize_player(level, score, hp);
    const player = playerObjects.player;
    const healthBar = playerObjects.healthBar;
    const scoreLabel = playerObjects.scoreLabel;

    // update_UI();

    player_events(player, healthBar, scoreLabel, level);
    player_movements(player);
    player_attacks(player);



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

start('game', { level: 1, score: 0, hp: 5 });