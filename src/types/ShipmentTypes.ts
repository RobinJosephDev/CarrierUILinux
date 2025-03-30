  export interface Shipment {
    id: number;
    ship_load_date: string;
    ship_pickup_location: string;
    ship_delivery_location: string;
    ship_driver: string;
    ship_weight: number;
    ship_ftl_ltl: string;
    ship_tarp: boolean;
    ship_equipment: string;
    ship_price: number;
    ship_notes: string;
    created_at: string;
    updated_at: string;
  }
  