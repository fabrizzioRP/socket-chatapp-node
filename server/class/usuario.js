
class Users {

    constructor() {
        this.people = [];
    }

    addPerson( id, name, sala ) {
        this.people.push( { id, name, sala } );
        return this.people;
    }

    getPerson( id ) {
        return this.people.filter( p => p.id === id )[0];
    }

    get getPeople() {
        return this.people;
    }

    getPersonPerRoom( room ) {
        return this.people.filter( p => p.sala === room );;
    }

    removePerson( id ) {
        let pr = this.getPerson( id );
        this.people = this.people.filter( p => p.id != id );
        return pr;
    }

}

module.exports = Users;