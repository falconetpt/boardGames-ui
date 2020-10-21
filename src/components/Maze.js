import * as React from "react";
import { useState, useEffect } from 'react';

export function Maze() {
    const [board, setBoard] = useState([]);
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");

    const renderBoard = event => {
        let value = event.target.value;
        let newBoard = [];

        for (let i = 0; i < value; i++) {
            let newList = [];
            for (let j = 0; j < value; j++) {
                newList.push(0);
            }
            newBoard.push(newList);
        }
        setBoard(newBoard);
    };

    const changeStart = (event) => {
        let value = event.target.value.split(",");
        setStart( { x: parseInt(value[0]), y: parseInt(value[1]) } )
    };

    const changeEnd = (event) => {
        let value = event.target.value.split(",");
        setEnd({ x: parseInt(value[0]), y: parseInt(value[1]) })
    };

    const placeWall = (event) => {
        let itemRowIndex = event.target.getAttribute("data-itemRow");
        let itemColIndex = event.target.getAttribute("data-itemCol");

        let newBoard = JSON.parse(JSON.stringify(board));

        newBoard[itemRowIndex][itemColIndex] = 1;

        setBoard(newBoard)
    };

    const tracePath = (result) => {
        let newBoard = JSON.parse(JSON.stringify(board));
        result.forEach(x => newBoard[x.x][x.y] = "V");
        setBoard(newBoard)
    };

    const submit = () => {

        fetch('http://localhost:8080/api/maze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*",
                "Access-Control-Allow-Headers": "X-Requested-With"
            },
            body: JSON.stringify({
                maze: board,
                start: start,
                end: end
            }),
        })
        .then((res) => res.json())
        .then((result) => tracePath(result))
        .catch((err) => console.log(err))
    };


    return (
        <div>
            <label>Size</label>
            <input id="size" onChange={renderBoard}/>
            <label>Start(x, y)</label>
            <input id="start" onChange={changeStart}/>
            <label>End(x, y)</label>
            <input id="end" onChange={changeEnd}/>
            <button onClick={submit}>Submit</button>

            <table style={{marginLeft: 'auto', marginRight: 'auto'}}>
                {

                    board.map((arr, i) =>
                        <tr>
                            {arr.map((e, j) =>
                                <td style={ { border: '1px solid pink' } }>
                                    <button
                                        style={{ backgroundColor: board[i][j] === "V" ? "green"
                                                : board[i][j] === 1 ? "red" :"white" }}
                                        data-itemRow={i}
                                        data-itemcol={j}
                                        onClick={placeWall}>{board[i][j]}</button>
                                </td>)}
                        </tr>)

                }
            </table>
    </div>);
}