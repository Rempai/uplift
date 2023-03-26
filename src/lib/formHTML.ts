import type {
  AttributeUpdate,
  PassageUpdate,
  PassengerUpdate,
  ReviewUpdate,
  RideUpdate,
  UserUpdate,
} from "@/lib/client";

export const userHTML = `
  <label for="username">Username</label>
  <input required type="text" name="username" placeholder="username" />
  <label for="password">Password</label>
  <input required type="password" name="password" placeholder="password" />
  <label for="repeatPassword">Repeat password</label>
  <input required type="password" name="repeat_password" placeholder="repeat_password" />
  <label for="isActive">IsActive</label>
  <input type="checkbox" name="isActive" checked={true} />
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
  <label for="fromLocation">From Location</label>
  <input required type="text" name="fromLocation" placeholder="Brooklyn" />
  <label for="toLocation">To Location</label>
  <input required type="text" name="toLocation" placeholder="Manhatton" />
  <label for="bravery">Bravery</label>
  <input required type="number" name="bravery" placeholder="5" />
  <label for="perseverance">Perseverance</label>
  <input required type="number" name="perseverance" placeholder="5" />
  <label for="integrity">Integrity</label>
  <input required type="number" name="integrity" placeholder="5" />
  <label for="enthusiasm">Enthusiasm</label>
  <input required type="number" name="enthusiasm" placeholder="5" />
  <label for="passengerId">passengerId</label>
  <input required type="number" name="passengerId" placeholder="1" />
`;

export const reviewHTML = `
  <label for="stars">Stars</label>
  <input required type="number" name="stars" placeholder="3" />
  <label for="description">Description</label>
  <textarea required name="description" placeholder="Lorem ipsum"></textarea>
  <label for="passengerId">Passenger id</label>
  <input required type="number" name="passengerId" placeholder="1" />
`;

export const passageHTML = `
  <label for="passage">Passage</label>
  <input required type="text" name="passage" placeholder="Paolo trunk" />
  <label for="content">Content</label>
  <textarea required name="content" placeholder="Lorem ipsum"></textarea>
  <label for="branch">Branch</label>
  <input type="text" name="branch" />
  <label for="speaker">Speaker</label>
  <input type="text" name="speaker" />
  <label for="continueButton">Continue Button</label>
  <input type="checkbox" name="continueButton" />
  <label for="trunk">Trunk</label>
  <input type="checkbox" name="trunk" />
  <label for="rideId">Ride id</label>
  <input required type="number" name="rideId" placeholder="1" />
  <label for="attributeId">Attributes id</label>
  <input required type="number" name="attributeId" placeholder="1" />
`;

export const attributeHTML = `
  <label for="color">Color</label>
  <input required type="text" name="color" placeholder="red" />
  <label for="fontSize">Font Size</label>
  <input required type="text" name="font_size" placeholder="1.2em" />
  <label for="fontFamily">Font Family</label>
  <input required type="text" name="fontFamily" placeholder="Arial" />
`;

export function userEditHTML(data: UserUpdate): string {
  const getOption = data.role;
  let option: string;

  const str = `
  <label for="username">Username</label>
  <input type="text" name="username" placeholder="Username" value="${data.username}" />
  <label for="isActive">isActive</label>
  <input type="checkbox" name="isActive" checked="${data.isActive}" />
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

export function passengerEditHTML(data: PassengerUpdate): string {
  return `
  <label for="name">Name</label>
  <input required type="text" name="name" placeholder="Name" value="${data.name}" />
  <label for="icon">Icon</label>
  <input required type="text" name="icon" placeholder="/paolo.png" value="${data.icon}" />
  `;
}

export function rideEditHTML(data: RideUpdate): string {
  return `
  <label for="fromLocation">From Location</label>
  <input required type="text" name="fromLocation" placeholder="Brooklyn" value="${data.fromLocation}" />
  <label for="toLocation">To Location</label>
  <input required type="text" name="toLocation" placeholder="Manhatton" value="${data.toLocation}" />
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
  <label for="passengerId">passenger id</label>
  <input required type="number" name="passengerId" placeholder="1" value="${data.passengerId}" />
  `;
}

export function reviewEditHTML(data: ReviewUpdate): string {
  return `
  <label for="stars">Stars</label>
  <input required type="number" name="stars" placeholder="3" value="${data.stars}" />
  <label for="description">Description</label>
  <textarea required name="description" placeholder="Lorem ipsum">${data.description}</textarea>
  <label for="passengerId">passengerId</label>
  <input required type="number" name="passengerId" placeholder="1" value="${data.rideId}" />
  `;
}

export function passageEditHTML(data: PassageUpdate): string {
  return `
  <label for="passage">Passage</label>
  <input required type="text" name="passage" placeholder="PaoloTrunk1" value="${data.passage}" />
  <label for="content">Content</label>
  <textarea required name="content">${data.content}</textarea>
  <label for="branch">Branch</label>
  <input required type="text" name="branch" placeholder="PaoloTrunk" value="${data.branch}" />
  <label for="speaker">Speaker</label>
  <input required type="text" name="speaker" placeholder="You" value="${data.speaker}" />
  <label for="continueButton">Continue Button</label>
  <input type="checkbox" name="continueButton" checked="${data.continueButton}" />
  <label for="trunk">Trunk</label>
  <input type="checkbox" name="trunk" checked="${data.trunk}" />
  <label for="attributeId">Attributes id</label>
  <input required type="number" name="attributeId" placeholder="1" value="${data.attributeId}" />
  <label for="rideId">Ride id</label>
  <input required type="number" name="rideId" placeholder="1" value="${data.rideId}" />
  `;
}

export function attributeEditHTML(data: AttributeUpdate): string {
  return `
  <label for="color">Color</label>
  <input type="text" name="color" placeholder="red" value="${data.color}" />
  <label for="fontSize">Font Size</label>
  <input type="text" name="fontSize" placeholder="1.2em" value="${data.fontSize}" />
  <label for="fontFamily">Font Family</label>
  <input type="text" name="fontFamily" placeholder="10" value="${data.fontFamily}" />
  `;
}
