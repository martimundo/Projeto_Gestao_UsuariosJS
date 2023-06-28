class User {

    constructor(name, gender, birth, country, email, password, photo, admin) {

        this._id;
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

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }
    get gender() {
        return this._gender;
    }
    get birth() {
        return this._birth;
    }
    get email() {
        return this._email;
    }
    get password() {
        return this._password;
    }
    get photo() {
        return this._photo;
    }
    get admin() {
        return this._admin;
    }
    get country() {
        return this._country;
    }
    get register() {
        return this._register;
    }

    //setters
    set name(name) {
        this._name = name;
    }
    set gender(gender) {
        this._gender = gender;
    }
    set birth(birth) {
        this._birth = birth;
    }
    set email(email) {
        this._email = email;
    }
    set password(password) {
        this._password = password;
    }
    set photo(photo) {
        this._photo = photo;
    }
    set admin(admin) {
        this._admin = admin;
    }
    set country(country) {
        this._country = country;
    }

    loadFromJson(json) {

        for (let name in json) {

            switch (name) {
                case "_register":
                    this[name] = new Date(json[name]);
                    break;
                default:
                    this[name] = json[name];
            }

        }

    }
    /**
   * Metodo que vai pegar os usuários que ja estão salvos na sessão.
   */
    static getUsersStorage() {

        let users = [];

        if (localStorage.getItem("users")) {

            users = JSON.parse(localStorage.getItem("users"));
        }
        return users;
    }
    /**
     * 
     * @returns Metodod para criar o ID do registro como se fosse um banco de dados.
     */
    getNewID() {

        let usersID = parseInt(localStorage.getItem("usersID"));

        if (!usersID > 0) usersID = 0;

        usersID++;

        localStorage.setItem("usersID", usersID);

        return usersID;
    }
    /**
     * Metodo para salvar os registros no localStorage
     */
    save() {

        let users = User.getUsersStorage();

        if (this.id > 0) {

            users.map(u => {

                if (u._id == this.id) {

                    Object.assign(u, this);

                }
                return u;
            });

        } else {

            this._id = this.getNewID();

            users.push(this);

        }
        //vai deixar os dados na sessão do navegador.
        //sessionStorage.setItem("users", JSON.stringify(users)); 
        localStorage.setItem("users", JSON.stringify(users));

    }
    /**
     * Metodo para remover o usuário 
     */
    remove(){

        let users = User.getUsersStorage();

        users.forEach((userData, index)=>{

            if(this._id == userData._id){
                users.splice(index, 1);
            }
        });

        localStorage.setItem("users", JSON.stringify(users));
    }
}