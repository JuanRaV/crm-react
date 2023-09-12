import {Form,useNavigate,useLoaderData,useActionData,redirect} from 'react-router-dom'
import Formulario from '../components/Formulario'
import Error from '../components/Error'
import {obtenerCliente,actualizarCliente} from '../data/clientes'

//Obtener los clientes
export async function loader({params}){
  const cliente = await obtenerCliente(params.clienteId)
  if(Object.values(cliente).length===0){
    //Creamos nuestra propia respuesta
    throw new Response('',{
      status:404,
      statusText: 'No hay resultados'
    })
  }
  return cliente
}

//Editar los clientes
export async function action({request,params}){
  const formData = await request.formData()
  //Obtenemos la informacion ingresada al formulario en forma de objeto
  const datos = Object.fromEntries(formData)
  const email = formData.get('email')
  let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");

  const errores = []

  
  if(!regex.test(email))
    errores.push('El Email no es valido')
  //Validacion

  if(Object.values(datos).includes('')){
    errores.push('Todos los campos son obligatorios')
  }
  //Retornar datos y errores
  if(Object.keys(errores).length){
    return errores
  }

  //Actualizar el cliente
  await actualizarCliente(params.clienteId,datos)

  return redirect('/')
}
const EditarCliente = () => {
  const navigate = useNavigate('/')
  const cliente = useLoaderData()
  const errores = useActionData()
  
  return (
    <>
      <h1 className="font-black text-4xl text-blue-900">Editar Cliente</h1>
      <p className="mt-3">A continuacion puedes modificarlos datos de un cliente</p>

      <div className="flex justify-end">
        <button
          className="bg-blue-800 text-white px-3 py-1 fontbold uppercase rounded-lg"
          onClick={()=>navigate('/')}
        >
          Volver
        </button>
      </div>

      <div className='bg-white shadow rounded-md md:w-3/4 mx-auto px-5 py-10 mt-20'>
        {errores?.length && errores.map((error,i)=><Error key={i}>{error}</Error>)}
        <Form 
          method='POST'
          noValidate
        >
          <Formulario
            cliente = {cliente}
          />
          <input
            type='submit'
            className='mt-5 w-full bg-blue-800 p-3 uppercase font-bold text-white text-lg hover:bg-blue-900 '
            value="Guardar Cliente"
          />
        </Form>
      </div>
    </>
  )
}

export default EditarCliente