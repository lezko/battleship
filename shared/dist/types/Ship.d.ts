export interface Point {
    row: number;
    col: number;
}
export interface ShipPosition {
    start: Point;
    end: Point;
}
export interface Ship {
    size: number;
    position: ShipPosition;
    decksHit: number;
}
export type ShipParameters = {
    [key: number]: number;
};
/**
 * Parameters of ships available in the game.
 * @key size of the ship (number of decks)
 * @value amount of ships of corresponding size
 */
export declare const shipParameters: ShipParameters;
export declare const shipsTotal: number;
export declare function getSunkShipsCount(ships: Ship[]): number;
