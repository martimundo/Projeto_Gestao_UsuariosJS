class UserController {

    constructor(formId, tableId) {

        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
    }

    addLine(dataUser) {

        console.log(dataUser);

        let tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `       
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-md"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Admin' : 'User'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
            <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>       
        `
        this.tableEl.appendChild(tr);
        this.updateCount();
    }

    updateCount(){

        let numerUsers=0;
        let numberUserAdmin = 0;
        [...this.tableEl.children].forEach(tr=>{

        numerUsers++;
        let userAdmin = JSON.parse(tr.dataset.user);
        if(userAdmin._admin) return numberUserAdmin++;

        });
        document.querySelector("#number-users").innerHTML = numerUsers;
        document.querySelector("#number-users-admin").innerHTML = numberUserAdmin;       
        
        
    }

    /**
     * Metodo que vai controlar os eventos do formulário
     * Nesse metodo usamos a Arrow Function evita conflitos
     */
    onSubmit() {

        this.formEl.addEventListener('submit', event => {
            event.preventDefault();

            let values = this.getValues();

            let btn = document.querySelector("[type=submit]");

            btn.disabled = true;

            if (!values) return false;

            this.getPhoto().then((content) => {

                values.photo = (content);
                this.addLine(values);

                this.formEl.reset();

                btn.disabled = false;

            }, (e) => {
                console.error(e)
            });
        });

    }

    /**
     * Metodo para carregar a foto inserida no cadastro
     */
    getPhoto() {

        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();//api de js para leitura de arquivos

            let elements = [...this.formEl.elements].filter(item => {

                if (item.name === 'photo') {

                    return item;
                }
            });
            let file = elements[0].files[0];

            fileReader.onload = () => {

                resolve(fileReader.result);
            };
            fileReader.onerror = (e) => {
                reject(e);
            };
            if (file) {
                fileReader.readAsDataURL(file);
            } else {
                resolve('dist/img/user1-128x128.jpg');
            }

        });


    }

    /**
     * Metodo que pega os atributos do formulário
     * @fields campos;
     * @objetUser instância da classe User
     */
    getValues() {

        let user = {};
        let isValid = true;

        //uso do operador spreed[...] não preciso passar quanto elementos eu tenho dentro do array
        [...this.formEl.elements].forEach(function (field, index) {

            //validando campos do formulário
            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {

                field.parentElement.classList.add('has-error');
                isValid = false;
            }

            if (field.name == "gender") {
                if (field.checked) {
                    user[field.name] = field.value;
                }
            } else if (field.name == "admin") {

                user[field.name] = field.checked;

            } else {
                user[field.name] = field.value;
            }
        });
        if (!isValid) {
            return false;
        }
        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin);

    }
}