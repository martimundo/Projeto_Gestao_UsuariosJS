class User {

    constructor(name, gender, birth, country, email, password, photo, admin) {

        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._email = email;
        this._password = password;
        this._photo = photo
        this._admin = admin;
        this._country = country;
        this._register = new Date();

    }
    //getters
    get name(){
        return this._name;
    }
    get gender(){
        return this._gender;
    }
    get birth(){
        return this._birth;
    }
    get email(){
        return this._email;
    }
    get password(){
        return this._password;
    }
    get photo(){
        return this._photo;
    }
    get admin(){
        return this._admin;
    }
    get country(){
        return this._country;
    }
    get register(){
        return this._register;
    }

    //setters
    set name(name){
         this._name = name;
    }
    set gender(gender){
         this._gender = gender;
    }
    set birth(birth){
         this._birth = birth;
    }
    set email(email){
         this._email = email;
    }
    set password(password){
         this._password = password;
    }
    set photo(photo){
         this._photo = photo;
    }
    set admin(admin){
         this._admin = admin;
    }
    set country(country){
         this._country = country;
    }
   
}