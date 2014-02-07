/*jslint browser:true */

(function () {

    'use strict';

    var canvas = document.querySelector('canvas'),
        context = canvas.getContext('2d'),
        input = document.querySelector('input[name="text"]'),
        game = JSON.parse(window.localStorage.getItem('game'));

    if (!game) {

        game = { turns: [ { type: 'text', content: null } ] };

    }

    function load_turn() {

        var current_turn = game.turns[game.turns.length - 1],
            previous_turn = game.turns[game.turns.length - 2];

        if (current_turn.type === 'text' && !current_turn.content) {

            if (previous_turn && previous_turn.content) {

                document.querySelector('.turn .text img').setAttribute('src', previous_turn.content);
                document.querySelector('.turn .text img').setAttribute('class', 'reference');

            }

            document.querySelector('.turn .text').setAttribute('class', 'text');
            document.querySelector('.turn .image').setAttribute('class', 'image hidden');

        } else {

            if (previous_turn && previous_turn.content) {

                document.querySelector('.turn .image p').innerHTML = previous_turn.content;

            }

            document.querySelector('.turn .text').setAttribute('class', 'text hidden');
            document.querySelector('.turn .image').setAttribute('class', 'image');

        }

    }

    function take_turn() {

        var current_turn = game.turns[game.turns.length - 1];

        if (current_turn.type === 'text') {

            if (input.value) {

                current_turn.content = input.value;

                input.value = '';

                input.blur();

                game.turns.push({ type: 'image', content: null });

                window.localStorage.setItem('game', JSON.stringify(game));

            }

        } else if (current_turn.type === 'image') {

            current_turn.content = canvas.toDataURL('image/png', 100);

            context.clearRect(0, 0, canvas.width, canvas.height);

            game.turns.push({ type: 'text', content: null });

            window.localStorage.setItem('game', JSON.stringify(game));

        }

        load_turn();

    }

    function preview_game(e) {

        var preview = document.querySelector('.preview');

        e.preventDefault();

        preview.innerHTML = '';

        game.turns.forEach(function (turn) {

            var node;

            if (turn.content) {

                if (turn.type === 'text') {

                    node = document.createElement('p');

                    node.appendChild(document.createTextNode(turn.content));

                    preview.appendChild(node);

                } else if (turn.type === 'image') {

                    node = document.createElement('img');

                    node.setAttribute('src', turn.content);

                    preview.appendChild(node);

                }

            }

        });

        document.querySelector('.game').setAttribute('class', 'game hidden');
        document.querySelector('.preview').setAttribute('class', 'preview');

    }

    function draw(e) {

        var scale_ratio = 1400 / context.canvas.offsetWidth;

        e.preventDefault();

        context.lineWidth = 4;
        context.lineCap = 'round';
        context.strokeStyle = '#222222';

        context.lineTo(e.layerX * scale_ratio, e.layerY * scale_ratio);
        context.stroke();

    }

    canvas.addEventListener('mousedown', function () {

        context.beginPath();

        this.addEventListener('mousemove', draw);

    });

    canvas.addEventListener('touchstart', function () {

        context.beginPath();

        this.addEventListener('touchmove', draw);

    });

    canvas.addEventListener('mouseup', function () {

        context.closePath();

        this.removeEventListener('mousemove', draw);

    });

    canvas.addEventListener('touchend', function () {

        context.closePath();

        this.removeEventListener('touchmove', draw);

    });

    document.querySelector('.game .continue').addEventListener('click', take_turn);
    document.querySelector('.game a[href="#preview"]').addEventListener('click', preview_game);
    document.querySelector('.game a[href="#reset"]').addEventListener('click', function (e) {

        e.preventDefault();

        if (window.confirm('Are you sure you want to reset this game?')) {

            game = { turns: [ { type: 'text', content: null } ] };

            window.localStorage.setItem('game', JSON.stringify(game));

            window.location.reload();

        }

    });

    document.querySelector('.turn .text input').addEventListener('keydown', function (e) {

        if (e.keyCode === 13) {

            take_turn();

        }

    });

    document.querySelector('a[href="#"]').addEventListener('click', function (e) {

        e.preventDefault();

        window.location.reload();

    });

    load_turn(game);

}());