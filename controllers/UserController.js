class UserController {

    constructor(formIdCreate, formIdUpdate, tableId) {

       
        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
        this.onEditCancel();
        this.selectAll();
    }

    /**
     * Metodo que pega os atributos do formulário
     * @fields campos;
     * @objetUser instância da classe User
     */
    getValues(formEl) {

        let user = {};
        let isValid = true;

        //uso do operador spreed[...] não preciso passar quanto elementos eu tenho dentro do array
        [...formEl.elements].forEach(function (field, index) {

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

    /**
     * Metodo que conta a quantidade de usuários
     */
    updateCount() {

        let numerUsers = 0;
        let numberUserAdmin = 0;
        [...this.tableEl.children].forEach(tr => {

            numerUsers++;
            let userAdmin = JSON.parse(tr.dataset.user);
            if (userAdmin._admin) return numberUserAdmin++;

        });
        document.querySelector("#number-users").innerHTML = numerUsers;
        document.querySelector("#number-users-admin").innerHTML = numberUserAdmin;
    }


    /**
     * Metodo para carregar a foto inserida no cadastro
     */
    getPhoto(formEl) {

        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();//api de js para leitura de arquivos

            let elements = [...formEl.elements].filter(item => {

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
     * Metodo que adiciona uma linha na tabela após os dados serem preenchidos no formulário
     */
    addLine(dataUser) {

        let tr = this.getTr(dataUser);

        this.tableEl.appendChild(tr);

        this.updateCount();
    }

    /**
     * Metodo que vai criar uma tr na tabela.
     */
    getTr(dataUser, tr = null) {

        if (tr === null) tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `       
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-md"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Admin' : 'User'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
            <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit">Editar</button>
            <button type="button" class="btn btn-danger  btn-delete btn-xs btn-flat">Excluir</button>
            </td>       
        `
        this.addEventsTr(tr);

        return tr;
    }

    /**
     * 
     * Metodo a verifica o click do botão editar para alterar os dados fórmulario
     */
    addEventsTr(tr) {

        tr.querySelector(".btn-delete").addEventListener("click", e => {

            if (confirm("Deseja excluir o registro?")) {

                let user = new User();

                user.remove();

                tr.remove();

                this.updateCount();
            }
        });

        tr.querySelector(".btn-edit").addEventListener("click", e => {

            let json = JSON.parse(tr.dataset.user);

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            for (let name in json) {

                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]");

                console.log(name, field);


                if (field) {
                    switch (field.type) {
                        case "file":
                            continue;
                            break;
                        case "radio":
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;
                            break;
                        case "checkbox":
                            field.checked = json[name];
                            break;
                        default:
                            field.value = json[name];
                    }
                }
            }

            this.formUpdateEl.querySelector(".photo").src = json._photo;

            this.showPanelUpdate();

        });
    }

    /**
    * Mostra o painel de edição e oculta o de criação e vice-versa
    */
    showPanelCreate() {
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
    }
    showPanelUpdate() {
        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";
    }

    /**
     * Metodo que vai controlar os eventos do formulário;
     * Com esse metodo são inseridas as linhas com dados preenchidos no formulário como se fosse via bd.
     * Nesse metodo usamos a Arrow Function evita conflitos
     */
    onSubmit() {

        this.formEl.addEventListener('submit', event => {

            event.preventDefault();

            let values = this.getValues(this.formEl);

            let btn = this.formEl.querySelector("[type=submit]");

            btn.disabled = true;

            if (!values) return false;

            this.getPhoto(this.formEl).then((content) => {

                values.photo = (content);

                values.save();

                this.addLine(values);

                this.formEl.reset();

                btn.disabled = false;

            }, (e) => {
                console.error(e)
            });
        });

    }

  

    /**
     * Faz um select na sessão
     */
    selectAll() {

        let users = User.getUsersStorage();

        users.forEach(dataUser => {

            let user = new User();

            user.loadFromJson(dataUser);

            this.addLine(user);
        });

    }

    // /**
    //  * Metodo que vai salvar os dados na sessão storage
    //  */
    // insert(data) {

    //     let users = this.getUsersStorage();

    //     users.push(data);

    //     //vai deixar os dados na sessão do navegador.
    //     //sessionStorage.setItem("users", JSON.stringify(users)); 
    //     localStorage.setItem("users", JSON.stringify(users));
    // }

    /**
     * Metodo para Atualizar ou cancelar os dados de edição.
     */
    onEditCancel() {

        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => {

            this.showPanelCreate();
        });
        //Para atualizar os dados da Tabela com os novos dados do form
        this.formUpdateEl.addEventListener("submit", event => {

            event.preventDefault();

            let btn = this.formUpdateEl.querySelector("[type=submit]");

            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl);

            let index = this.formUpdateEl.dataset.trIndex;

            let tr = this.tableEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user);

            let result = Object.assign({}, userOld, values);

            btn.disabled = false;

            this.getPhoto(this.formUpdateEl).then((content) => {

                if (!values.photo) {
                    result._photo = userOld._photo;
                } else {
                    result._photo = content;
                }

                let user = new User();

                user.loadFromJson(result);

                user.save();

                this.getTr(user, tr);

                this.updateCount();

                this.formUpdateEl.reset();
                
                btn.disabled = false;

                this.showPanelCreate();

            }, (e) => {
                console.error(e)
            });

        })
    }



}