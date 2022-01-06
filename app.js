const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquireMenu,
    pausa,
    leerInput,
    listadoTareasBorrar,
    confirmar,
    mostrarListadoCheckList,
    toggleCompletadas } = require('./helpers/inquirer');
const Tareas = require('./models/tareas');

require('colors');
console.clear()

const main = async () => {

    let opt = ''
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if (tareasDB) {
        tareas.cargarTareasFromArray(tareasDB)
    }

    do {

        //Esta opcion imprime el menu
        opt = await inquireMenu();

        switch (opt) {

            case '1': //crear opcion      
                const desc = await leerInput('Descripcion:');
                tareas.crearTarea(desc);

                break;

            case '2': //listar tareas
                tareas.listadoCompleto();
                break;

            case '3': //listar tareas completadas
                tareas.listarPendientesCompletadas(true);
                break;

            case '4': //listar tareas pendientes
                tareas.listarPendientesCompletadas(false);
                break;

            case '5': // completado / pendiente
                const ids = await mostrarListadoCheckList(tareas.listadoArr);
                tareas.toggleCompletadas(ids);
                break;

            case '6':
                const id = await listadoTareasBorrar(tareas.listadoArr)
                if (id !== '0') {
                    const ok = await confirmar('Estas seguro?');
                    if (ok) {
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada')
                    }
                    console.log({ ok });
                }

                break;
        }

        guardarDB(tareas.listadoArr);


        await pausa();

    } while (opt !== '0');


    //pausa()

}


main();