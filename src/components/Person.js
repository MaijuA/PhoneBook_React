import React from "react";

const Person = ({ name, phoneNumber, deletePerson }) => (
  <tr>
    <td>{name}</td>
    <td>{phoneNumber}</td>
    <td>
      <button onClick={deletePerson}>Poista</button>
    </td>
  </tr>
);

export default Person;
