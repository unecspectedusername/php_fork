window.onload = function() {
    makeRandomPerson();
};

function makeRandomPerson () {
    let person = personGenerator.getPerson();
    document.querySelector('#image').style.backgroundImage = `url('${person.avatar}')`;
    document.querySelector('#name').textContent = `${person.firstName} ${person.middleName} ${person.surname}`;
    document.querySelector('#gender').textContent = person.gender;
    document.querySelector('#date').textContent = person.birthDate;
    document.querySelector('#profession').textContent = person.profession;
}

document.querySelector('#generate').addEventListener('click', function() {
    makeRandomPerson();
});

document.querySelector('#clear').addEventListener('click', function() {
    document.querySelector('#image').style.backgroundImage = null;
    document.querySelector('#name').textContent = null;
    document.querySelector('#gender').textContent = null;
    document.querySelector('#date').textContent = null;
    document.querySelector('#profession').textContent = null;
});
