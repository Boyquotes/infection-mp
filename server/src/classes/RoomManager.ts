/** 
 * @class
 * @description Represents the manager of a room ledger
*/

import { Player, Room } from "./";
import { PlayerRoom } from "../types";
import { MessageEventCode } from "../enums";

export class RoomManager {

    private _rooms: Set<Room>;
    private _playerRooms: Set<PlayerRoom>;

    constructor(){
        this._rooms = new Set();
        this._playerRooms = new Set();
    }

    public addRoom(room: Room): void {
        this._rooms.add(room);
    }

    public removeRoom(room: Room): void {
        this._rooms.delete(room);
    }

    public addPlayerToRoom(room: Room, player: Player): void {
        this._playerRooms.add({ roomCode: room.code, player: player });
    }

    public removePlayerFromRoom(room: Room, player: Player): void {
        const target: PlayerRoom | undefined = Array.from(this._playerRooms).find((playerRoom: PlayerRoom) => playerRoom.player === player && playerRoom.roomCode === room.code);
        if(!target) throw new Error("Could not find target player.");
        this._playerRooms.delete(target);
    }

    public getRoomByCode(roomCode: string): Room | undefined {
        return Array.from(this._rooms).find((room: Room) => room.code === roomCode);
    }

    public getAllPlayersInRoom(room: Room): Player[] {
        return Array.from(this._playerRooms)
        .filter((playerRoom: PlayerRoom) => playerRoom.roomCode === room.code)
        .map((playerRoom: PlayerRoom) => playerRoom.player);
    }

    public broadcastMessageToRoom(room: Room, event: MessageEventCode, message: object): void {
        Array.from(this._playerRooms).forEach((playerRoom: PlayerRoom) => {
            if(playerRoom.roomCode === room.code) playerRoom.player.socket.send(JSON.stringify({ Event: event, Message: JSON.stringify(message) }));
        });
    }

}

export default RoomManager;