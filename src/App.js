import React from "react";
import "./App.css";
import List from "./components/List";
import personService from "./services/persons";
import Notification from "./components/Notification";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      persons: [],
      newName: "",
      newPhoneNumber: "",
      filter: ""
    };
  }

  componentDidMount() {
    console.log("did mount");
    personService.getAll().then(response => {
      console.log("promise fulfilled");
      this.setState({ persons: response.data });
    });
  }

  handleFilterChange = event => {
    this.setState({ filter: event.target.value });
  };

  handleNameChange = event => {
    this.setState({ newName: event.target.value });
  };

  handlePhoneNumberChange = event => {
    this.setState({ newPhoneNumber: event.target.value });
  };

  resetInput = persons => {
    this.setState({
      persons,
      newName: "",
      newPhoneNumber: "",
      filter: "",
      notification: null,
      notificationType: 'info'
    });
  };

  error = message => {
    this.notify(message, "error");
  };

  notify = (message, type) => {
    this.setState({ notification: message, notificationType: type });
    setTimeout(() => {
      this.setState({ notification: null });
    }, 5000);
  };

  info = (message) => {
    this.notify(message, 'info')
  }

  addName = event => {
    event.preventDefault();
    const person = this.state.persons.find(
      person => person.name === this.state.newName
    );
    let newPerson = {};

    if (!person) {
      const nameObject = {
        name: this.state.newName,
        phoneNumber: this.state.newPhoneNumber
      };

      personService.create(nameObject).then(response => {
        this.setState({
          persons: this.state.persons.concat(response.data),
          newName: "",
          newPhoneNumber: ""
        });
        this.info(`lisättiin ${nameObject.name}`)
      });
    } else {
      console.log("on jo")
        ;
      if (
        window.confirm(
          `${person.name} on jo luettelossa, korvataanko vanha numero uudella?`
        )
      ) {
        newPerson = { ...person, phoneNumber: this.state.newPhoneNumber }
        personService
          .update(person.id, newPerson)
          .then(changedPerson => {
            const persons = this.state.persons.filter(p => p.id !== changedPerson.id)
            this.resetInput(persons.concat(changedPerson))
            this.info(`Päivitettiin ${changedPerson.name}`);

          })
          .catch(response => {
            this.resetInput(this.state.persons.filter(p => p.id !== person.id));
            this.error(`henkilö ${person.name} on jo poistettu palvelimelta`);
          });
      }
    }
  };

  deletePerson = person => () => {
    if (window.confirm(`Poistetaanko ${person.name}?`)) {
      personService
        .deleteById(person.id)
        .then(removedPerson => {
          this.resetInput(this.state.persons.filter(p => p.id !== person.id));
          this.info(`poistettiin ${person.name}`);
        })
        .catch(response => {
          this.resetInput(this.state.persons.filter(p => p.id !== person.id));
          this.error(`henkilön ${person.name} poisto epäonnistui`);
        });
    }
  };

  render() {
    const personsToShow = this.state.persons.filter(person =>
      person.name.toUpperCase().includes(this.state.filter.toUpperCase())
    );
    return (
      <div>
        <h2>Puhelinluettelo</h2>
        <Notification
          message={this.state.notification}
          type={this.state.notificationType} />
        <div>
          <p>Etsi luettelosta</p>
          <input value={this.state.filter} onChange={this.handleFilterChange} />
        </div>
        <h3>Lisää uusi puhelinnumero</h3>
        <form onSubmit={this.addName}>
          <div>
            Nimi:{" "}
            <input
              value={this.state.newName}
              onChange={this.handleNameChange}
            />
          </div>
          <div>
            Puhelinnumero:{" "}
            <input
              value={this.state.newPhoneNumber}
              onChange={this.handlePhoneNumberChange}
            />
          </div>
          <div>
            <button id="add" type="submit">
              Lisää
            </button>
          </div>
        </form>
        <h3>Numerot</h3>
        <table id="customers">
          <tbody>
            <tr>
              <th>Nimi</th>
              <th>Numero</th>
              <th>Poista</th>
            </tr>
            <List persons={personsToShow} deletePerson={this.deletePerson} />
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
