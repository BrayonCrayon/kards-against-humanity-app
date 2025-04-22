"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var BlackKard_1 = require("@/Components/BlackKard");
var BlackCardFactory_1 = require("@/Tests/Factories/BlackCardFactory");
var react_transition_group_1 = require("react-transition-group");
var WhiteKard_1 = require("@/Components/WhiteKard");
var WinnerRoom = function (props) {
    var winner = props.winner, winnerCards = props.winnerCards, submissions = props.submissions, _a = props.onEnd, onEnd = _a === void 0 ? function () { } : _a, _b = props.onShowWinner, onShowWinner = _b === void 0 ? function () { } : _b;
    var _c = (0, react_1.useState)(true), showDrum = _c[0], setShowDrum = _c[1];
    var _d = (0, react_1.useState)([submissions[0]]), submittedCards = _d[0], setSubmittedCards = _d[1];
    (0, react_1.useEffect)(function () {
        var timeout = setInterval(function () {
            setShowDrum(false);
            onShowWinner();
        }, 5000);
        return function () {
            clearInterval(timeout);
        };
    }, []);
    (0, react_1.useEffect)(function () {
        if (showDrum) {
            return;
        }
        var timeout = setInterval(function () {
            onEnd();
        }, 10000);
        return function () {
            clearInterval(timeout);
        };
    }, [showDrum]);
    return <div className="flex flex-col justify-center items-center w-full" data-testid="display-winner">
    <div className="p-8">
      <BlackKard_1.BlackKard card={(0, BlackCardFactory_1.blackCardFactory)()}/>
    </div>
    <div className="flex flex-row justify-center items-center w-full">
    <react_transition_group_1.TransitionGroup>
      {submissions.map(function (_a) {
            var submitted_cards = _a.submitted_cards, user_id = _a.user_id;
            return (submitted_cards.map(function (card) { return (<react_transition_group_1.CSSTransition key={card.id} timeout={10000} classNames="item">
                <div>
                  <WhiteKard_1.WhiteKard hidePlayButton className="w-64" card={card} onClick={function () { }}/>
                </div>
              </react_transition_group_1.CSSTransition>); }));
        })}
    </react_transition_group_1.TransitionGroup>
    </div>
    {/*<div className="p-8 h-full flex flex-col items-center gap-10">*/}
    {/*    <h1 data-testid={`user-${player.id}`} className="text-4xl text-center p-4 bg-white w-fit rounded-sm">The winner is: {player.name}</h1>*/}
    {/*    <div className="flex flex-wrap gap-2 justify-center">*/}
    {/*      {*/}
    {/*        cards.map(card =>*/}
    {/*          <WhiteKard key={card.id} hidePlayButton className="w-64" card={card} onClick={() => {}} />*/}
    {/*        )*/}
    {/*      }*/}
    {/*    </div>*/}
    {/*    <div className="absolute top-0 left-0 w-full">*/}
    {/*      <ReactConfetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={2000} recycle={false}  />*/}
    {/*    </div>*/}
    {/*  </div>*/}
  </div>;
};
exports.default = WinnerRoom;
