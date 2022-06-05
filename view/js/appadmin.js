$(document).ready(function () {
    let btnAdd = document.getElementById('btn-add');
    let btnClose = document.getElementById('btnClose');
    let modalEdit = document.querySelector('.container-edits');
    let opTables = document.getElementById('tables');
    let opHistory = document.getElementById('history');
    let selectUsers = document.getElementById('users');
    let selectStores = document.getElementById('stores');
    let btnAcepts = document.getElementsByClassName('btn-acept');
    let btnDelete = document.getElementById('btn-delete');
    let btnCancel = document.getElementById('cancel');
    let table = '';
    let link='';
    let idUser='';

//Inicializar vista

    
    seeUsers();

    $('#tables').addClass('active');

    $('#modals').hide();
    $('#modal-edit-user').hide();
    $('#alert-succes').hide();
    $('#alert-error').hide();
    $('#alert-warning').hide();
    $('#seehistory').hide();
    $('#container-table').hide();
    $('#load-table-users').hide();
    $('#load-table-stores').hide();

// Opciones

    btnAdd.addEventListener('click', () => {
        modalEdit.classList.toggle('close');
        $('#title-modal').text('Agregar usuario:');
        $('#btn-modal').text('Agregar');
        $('#modals').show();
    });

    $('#btn-close-act').click(function(){
        $('#modals').hide();
        $('#modal-edit-user').hide();
    });

    btnClose.addEventListener('click', () => {
        modalEdit.classList.toggle('close');
        $('#modals').hide();
    });

    opTables.addEventListener('click', () => {
        $('#tables').addClass('active');
        $('#history').removeClass('active');

        $('#grid-tables').show();
        $('#container-table').hide();
        $('#load-table-users').hide();
        $('#load-table-stores').hide();
        $('#seehistory').hide();
    });

    opHistory.addEventListener('click', () => {
        $('#history').addClass('active');
        $('#tables').removeClass('active');

        $('#seehistory').show();
        $('#container-table').hide();
        $('#load-table-users').hide();
        $('#load-table-stores').hide();
        $('#grid-tables').hide();
    });

// Select grid

    selectUsers.addEventListener('click', () => {
        table = $('#table-users').DataTable();
        table.destroy();
        table = $('#table-users').DataTable( {
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
                }
        } );
        $('#container-table').show();
        $('#load-table-users').show();
        $('#grid-tables').hide();
    });

    selectStores.addEventListener('click', () => {
        $('#table-stores').DataTable({
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
                }
        });
        $('#container-table').show();
        $('#load-table-stores').show();
        $('#grid-tables').hide();
    });

// Añadir usuario

$("#form-add-user").submit(function (e) {

    e.preventDefault();

    var data = $(this).serializeArray();

    $.ajax({
        type: "post",
        url: "../controller/action/actAddUser.php",
        data: data,
        dataType: "json",
        success: function (result) {
            modalEdit.classList.toggle('close');
            table.destroy();
            clearTable();
            seeUsers();
            $('#alert-succes').show();
            $('#form-add-user')[0].reset();
        }
    });

});

// Actualizar usuario

$('#form-act-user').submit(function(e){

    e.preventDefault();

    var data = $(this).serializeArray();

    $.ajax({
        type: "post",
        url: "../controller/action/actModifyUser.php",
        data: data,
        dataType: "json",
        success: function (result) {
            $('#alert-succes').show();
            $('#modal-edit-user').hide();
            table.destroy();
            clearTable();
            seeUsers();
        }
    });

});

//Alerts

for(let i = 0; i<btnAcepts.length; i++){
    btnAcepts[i].addEventListener('click', closeModal, false);
}

function closeModal() {
    $('#modals').hide();
    $('#alert-succes').hide();
    $('#alert-error').hide();
    $('#alert-warning').hide();
}

//Ver usuario

function seeUsers(){
    $.ajax({
        url: "../controller/action/actSeeUsers.php",
        success: function(result){
            insertUsers(JSON.parse(result))
        },
        error: function(xhr){
            $('#alert-error').show();
        }});
}

function insertUsers(result){
    let users = '';

    $.each(result, function(i) {

        users +='<tr id='+result[i].id+'>'
        +'<td>'+result[i].id+'</td>'
        +'<td>'+result[i].name+'</td>'
        +'<td>'+result[i].email+'</td>'
        +'<td>'+result[i].phone+'</td>'
        +'<td>'+result[i].dir+'</td>'
        +'<td>'+result[i].photo+'</td>'
        +'<td>'+result[i].admin+'</td>'
        +'<td class="btns">'
        +'<button value='+result[i].id+' title="Editar" class="btnEdit btn-edit-user"><i class="bx bx-pencil"></i></button>'
        +'<button value='+result[i].id+' title="Eliminar" class="btnDelete btn-delete-user"><i class="bx bx-trash"></i></button>'
        +'</td>'
        +'</tr>'
    });

    $("#table-users tbody").append(users);
    table = $('#table-users').DataTable( {
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
            }
    } );
    activeDeleteButtons();
    activeEditButtons();
}

function activeEditButtons(){
    $('.btn-edit-user').on('click', function(){

        let idUser = $(this).val();

        let link = '../controller/action/actSeeUser.php?idUser='+ idUser;

        $.ajax({
            url: link,
            data: idUser,
            success: function(data){
                let aux = JSON.parse(data);
                $('#modals').show();
                $('#modal-edit-user').show();
                $('#modal-edit-user input[name=idUser]').val(aux.id);
                $('#modal-edit-user input[name=newname]').val(aux.name);
                $('#modal-edit-user input[name=newemail]').val(aux.email);
                $('#modal-edit-user input[name=newphone]').val(aux.phone);
                $('#modal-edit-user input[name=newdir]').val(aux.dir);
                $('#modal-edit-user input[name=newpass]').val(aux.password);

            }
        });
        
    });
}

function activeDeleteButtons(){
    $('.btn-delete-user').on('click', function(){
        $('#modals').show();
        $('#alert-warning').show();
        idUser = $(this).val();
    });
}

btnDelete.addEventListener('click', () => {
    if(idUser==null){

    }else{
        link = '../controller/action/actDeleteUserAdmin.php?idUser='+ idUser;
        $.ajax({
            url: link,
            data: idUser,
            success: function (result) {
                table.destroy();
                clearTable();
                seeUsers();
                $('#modals').show();
                $('#alert-succes').show();
                
                idUser=null;
            }
        });
    }

}, false);

function clearTable(){
    $('#tbody-users tr').remove();
}

});
