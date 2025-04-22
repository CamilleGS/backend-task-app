const express = require("express")
const app = express()
const uuid = require('uuid')
const PORT = 3010
const cors = require('cors')
app.use(express.json())

const task = [] 

app.use(cors())

const middleware = (resquest, response, next) =>{
    const { id } = resquest.params

    const index = task.findIndex((tasks) => {

      return tasks.id === id
        
    
    })

    if(index < 0){
        return response.status(404).json({message: "task not found"})
    }

    resquest.taskId = id
    resquest.taskIndex = index

    next()
}


app.get('/task', (request, response)=>{
     return response.json(task)
})

app.post('/task',(request, response)=>{
    const { taskName } = request.body
    const status = "in preparation"

    const taskList = {id:uuid.v4(), taskName, status}

    task.push(taskList)
    return response.status(201).json(taskList) 
})


app.put('/task/:id',middleware, (request, response) => {
    const { taskName, status } = request.body

    const id = request.taskId
    const index = request.taskIndex

    const newTasks = { id, taskName, status }


    task[index] = newTasks

    return response.status(200).json(newTasks)

})

app.delete('/task/:id', middleware, (request, response)=>{
    const index = request.taskIndex

    //SPLICE PARA APAGAR O ITEM ESPECIFICO DO ARRAY
    task.splice(index, 1)

    //SEMPRE MANDAR UMA MENSAGEM POIS O INSOMIA APAGA E FICA ESPERANDO UMA MENSAGEM
    return response.status(200).json({ message: "Task deleted successfully" })
})

app.listen(PORT, ()=>{
    console.log('app rodando '+PORT)
})