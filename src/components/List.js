import React from "react";
import Person from "./Person";

const List = ({ persons, deletePerson }) =>
  persons.map(person => (
    <Person
      key={person.name}
      deletePerson={deletePerson(person)}
      name={person.name}
      phoneNumber={person.phoneNumber}
    />
  ));

export default List;
