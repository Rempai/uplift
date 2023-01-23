import type {
  AttributeRead,
  PassageRead,
  PassengerRead,
  ReviewCreate,
  RideRead,
  UserRead,
} from "@/lib/client";

export const userHTML = `
  <label for="username">Username</label>
  <input required type="text" name="username" placeholder="username" />
  <label for="password">Password</label>
  <input required type="password" name="password" placeholder="password" />
  <label for="repeat_password">Repeat password</label>
  <input required type="password" name="repeat_password" placeholder="repeat_password" />
  <label for="disabled">Disabled</label>
  <input type="checkbox" name="disabled" checked={true} />
  <label for="role">Role</label>
  <select name="role">
    <option value="User" selected>User</option>
    <option value="Admin">Admin</option>
  </select>
`;

export const passengerHTML = `
  <label for="name">Name</label>
  <input required type="text" name="name" placeholder="name" />
  <label for="icon">Icon</label>
  <input required type="text" name="icon" placeholder="/paolo.png" />
`;

export const rideHTML = `
  <label for="time">Time</label>
  <input required type="number" name="time" placeholder="60" />
  <label for="from_location">from_location</label>
  <input required type="text" name="from_location" placeholder="Brooklyn" />
  <label for="to_location">to_location</label>
  <input required type="text" name="to_location" placeholder="Manhatton" />
  <label for="bravery">Bravery</label>
  <input required type="number" name="bravery" placeholder="5" />
  <label for="perseverance">Perseverance</label>
  <input required type="number" name="perseverance" placeholder="5" />
  <label for="integrity">Integrity</label>
  <input required type="number" name="integrity" placeholder="5" />
  <label for="enthusiasm">Enthusiasm</label>
  <input required type="number" name="enthusiasm" placeholder="5" />
  <label for="passenger_id">passenger_id</label>
  <input required type="number" name="passenger_id" placeholder="1" />
`;

export const reviewHTML = `
  <label for="stars">Stars</label>
  <input required type="number" name="stars" placeholder="3" />
  <label for="description">Description</label>
  <textarea required name="description" placeholder="Lorem ipsum"></textarea>
  <label for="passenger_id">Passenger id</label>
  <input required type="number" name="passenger_id" placeholder="1" />
`;

export const passageHTML = `
  <label for="passage_name">Passage Name</label>
  <input required type="text" name="passage_name" placeholder="Paolo trunk" />
  <label for="passage_content">Passage Content</label>
  <input required type="file" name="passage_content" />
  <label for="branch_name">Branch Name</label>
  <input type="text" name="branch_name" />
  <label for="speaker">Speaker</label>
  <input type="text" name="speaker" />
  <label for="continue_button">Continue Button</label>
  <input type="checkbox" name="continue_button" />
  <label for="trunk">Trunk</label>
  <input type="checkbox" name="trunk" />
  <label for="ride_id">Ride id</label>
  <input required type="number" name="ride_id" placeholder="1" />
  <label for="attribute_id">Attributes id</label>
  <input required type="number" name="attribute_id" placeholder="1" />
`;

export const attributeHTML = `
  <label for="color">Color</label>
  <input required type="text" name="color" placeholder="red" />
  <label for="font_size">Font Size</label>
  <input required type="text" name="font_size" placeholder="1.2em" />
  <label for="font_family">Font Family</label>
  <input required type="text" name="font_family" placeholder="Arial" />
`;

export function userEditHTML(data: UserRead): string {
  const getOption = data.role;
  let option: string;

  const str = `
  <label for="username">Username</label>
  <input type="text" name="username" placeholder="Username" value="${data.username}" />
  <label for="disabled">Disabled</label>
  <input type="checkbox" name="disabled" checked="${data.disabled}" />
  <label for="role">Role</label>
  `;

  if (getOption === "Admin") {
    option = `
      <select name="role">
        <option value="User">User</option>
        <option value="Admin" selected>Admin</option>
      </select>
    `;
  } else {
    option = `
      <select name="role">
        <option value="User" selected>User</option>
        <option value="Admin">Admin</option>
      </select>
    `;
  }

  return str + option;
}

export function passengerEditHTML(data: PassengerRead): string {
  return `
  <label for="name">Name</label>
  <input required type="text" name="name" placeholder="Name" value="${data.name}" />
  <label for="icon">Icon</label>
  <input required type="text" name="icon" placeholder="/paolo.png" value="${data.icon}" />
  `;
}

export function rideEditHTML(data: RideRead): string {
  return `
  <label for="from_location">from_location</label>
  <input required type="text" name="from_location" placeholder="Brooklyn" value="${data.from_location}" />
  <label for="to_location">to_location</label>
  <input required type="text" name="to_location" placeholder="Manhatton" value="${data.to_location}" />
  <label for="time">Time</label>
  <input required type="number" name="time" placeholder="60" value="${data.time}" />
  <label for="bravery">Bravery</label>
  <input required type="number" name="bravery" placeholder="5" value="${data.bravery}" />
  <label for="perseverance">Perseverance</label>
  <input required type="number" name="perseverance" placeholder="5"  value="${data.perseverance}"/>
  <label for="integrity">Integrity</label>
  <input required type="number" name="integrity" placeholder="5" value="${data.integrity}" />
  <label for="enthusiasm">Enthusiasm</label>
  <input required type="number" name="enthusiasm" placeholder="5" value="${data.enthusiasm}" />
  <label for="passenger_id">passenger id</label>
  <input required type="number" name="passenger_id" placeholder="1" value="${data.passenger.id}" />
  `;
}

export function reviewEditHTML(data: ReviewCreate): string {
  return `
  <label for="stars">Stars</label>
  <input required type="number" name="stars" placeholder="3" value="${data.stars}" />
  <label for="description">Description</label>
  <textarea required name="description" placeholder="Lorem ipsum">${data.description}</textarea>
  <label for="passenger_id">Passenger_id</label>
  <input required type="number" name="passenger_id" placeholder="1" value="${data.passenger_id}" />
  `;
}

export function passageEditHTML(data: PassageRead): string {
  return `
  <label for="passage_name">Passage Name</label>
  <input required type="text" name="passage_name" placeholder="PaoloTrunk1" value="${data.passage_name}" />
  <label for="passage_content">Passage Content</label>
  <textarea required name="passage_content">${data.passage_content}</textarea>
  <label for="branch_name">Branch Name</label>
  <input required type="text" name="branch_name" placeholder="PaoloTrunk" value="${data.branch_name}" />
  <label for="speaker">Speaker</label>
  <input required type="text" name="speaker" placeholder="You" value="${data.speaker}" />
  <label for="continue_button">Continue Button</label>
  <input type="checkbox" name="continue_button" checked="${data.continue_button}" />
  <label for="trunk">Trunk</label>
  <input type="checkbox" name="trunk" checked="${data.trunk}" />
  <label for="attribute_id">Attributes id</label>
  <input required type="number" name="attribute_id" placeholder="1" value="${data.attribute_id}" />
  <label for="ride_id">Ride id</label>
  <input required type="number" name="ride_id" placeholder="1" value="${data.ride_id}" />
  `;
}

export function attributeEditHTML(data: AttributeRead): string {
  return `
  <label for="color">Color</label>
  <input type="text" name="color" placeholder="red" value="${data.color}" />
  <label for="font_size">Font Size</label>
  <input type="text" name="font_size" placeholder="1.2em" value="${data.font_size}" />
  <label for="font_family">Font Family</label>
  <input type="text" name="font_family" placeholder="10" value="${data.font_family}" />
  `;
}
