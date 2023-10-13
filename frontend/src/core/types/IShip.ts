export interface IPoint {
    row: number;
    col: number;
}

export interface IShipPosition {
    start: IPoint;
    end: IPoint;
}

export interface IShip {
    size: number;
    position: IShipPosition;
    decksHit: number;
}
