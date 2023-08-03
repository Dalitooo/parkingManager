const vehicleTypes = {
   CAR: 'Car',
   BIKE: 'Bike',
   TRUCK: 'Truck'
}

class Vehicle {
   constructor(type) {
       this.type = type;
   }
}

class Slot {
   constructor(type, floorNumber, slotNumber) {
      this.type = type;
      this.floorNumber = floorNumber;
      this.slotNumber = slotNumber;
      this.vehicle = null;
   }

   park(vehicle) {
      this.vehicle = vehicle;
   }

   leave() {
      this.vehicle = null;
   }

   isAvailable() {
      return !this.vehicle;
   }
}

class Floor {
   constructor(floorNumber, slots) {
      this.floorNumber = floorNumber;
      this.slots = slots || [];
   }
   //slotsAvailable
   countAvailableSlots(vehicleType) {
      return this.slots.filter(slot => slot.isAvailable() && slot.type === vehicleType).length;
   }
}

class ParkingLot {
   constructor(floors) {
      this.floors = floors || [];
   }
   //slotsAvailable on each floor 
   countAvailableSlots(vehicleType) {
      return this.floors.map(floor => floor.countAvailableSlots(vehicleType));
   }
}

class Ticket {
   constructor(slot, vehicle) {
      this.slot = slot;
      this.vehicle = vehicle;
      this.id = Math.random().toString(36).substr(2, 9);
   }
}

class ParkingManager {
   constructor(parkingLot) {
      this.parkingLot = parkingLot;
      this.tickets = {};
   }
   //Finding the first available slot 
   findSlot(vehicleType) {
      for (let i = 0; i < this.parkingLot.floors.length; i++) {
         const floor = this.parkingLot.floors[i];
         for (let j = 0; j < floor.slots.length; j++) {
            const slot = floor.slots[j];
            if (slot.isAvailable() && slot.type === vehicleType) {
               return slot;
            }
         }
      }
      return null;
   }

   park(vehicle) {
      const slot = this.findSlot(vehicle.type);
      if (!slot) {
         console.log('No available slot');
      }
      slot.park(vehicle);
      const ticket = new Ticket(slot, vehicle);
      this.tickets[ticket.id] = ticket;
      return ticket;
   }

   leave(ticketId) {
      const ticket = this.tickets[ticketId];
      if (!ticket) {
         console.log('Invalid ticket id');
      }
      ticket.slot.leave();
      delete this.tickets[ticket.id];
   }
}

//create a few slots for each floor
const slotsOnFloor1 = [new Slot(vehicleTypes.CAR, 1, 1), new Slot(vehicleTypes.BIKE, 1, 2)];
const slotsOnFloor2 = [new Slot(vehicleTypes.CAR, 2, 1), new Slot(vehicleTypes.TRUCK, 2, 2)];

//create floors
const floor1 = new Floor(1, slotsOnFloor1);
const floor2 = new Floor(2, slotsOnFloor2);

//create a parking lot with the created floors
const parkingLot = new ParkingLot([floor1, floor2]);

//create a parking manager with the parking lot
const parkingManager = new ParkingManager(parkingLot);

//create some vehicles
const car1 = new Vehicle(vehicleTypes.CAR);
const bike1 = new Vehicle(vehicleTypes.BIKE);
const truck1 = new Vehicle(vehicleTypes.TRUCK);


//2.Given a vehicle, it finds the first available slot, books it, creates a ticket, parks the vehicle, and finally returns the ticket. 
const ticket1 = parkingManager.park(car1);
const ticket2 = parkingManager.park(bike1);
const ticket3 = parkingManager.park(truck1);

//print the issued tickets
console.log('Ticket 1:', ticket1);
console.log('Ticket 2:', ticket2);
console.log('Ticket 3:', ticket3);

//1.Display the number of free slots per floor for a specific vehicle type. 
console.log('Available Car slots:', parkingManager.parkingLot.countAvailableSlots(vehicleTypes.CAR));
console.log('Available Bike slots:', parkingManager.parkingLot.countAvailableSlots(vehicleTypes.BIKE));
console.log('Available Truck slots:', parkingManager.parkingLot.countAvailableSlots(vehicleTypes.TRUCK));

//4.Unparks a vehicle given the ticket id. 
parkingManager.leave(ticket2.id);
parkingManager.leave(ticket1.id);

//count available slots for bikes after leaving a bike
console.log('Available Bike slots after leaving:', parkingManager.parkingLot.countAvailableSlots(vehicleTypes.BIKE));
console.log('Available car slots after leaving:', parkingManager.parkingLot.countAvailableSlots(vehicleTypes.CAR));


