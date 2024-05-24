// // import { ref, onUnmounted } from 'vue'
// import axios from 'axios'

// const activeTasks = ref([])
// const archivedTasks = ref([])

// let eventSource = null


// const startEventSource = async () => {
//   console.log("1")
//   if (typeof window !== 'undefined' && !eventSource) {
//     console.log("2")
//     eventSource = new EventSource('http://192.168.1.120:8001/stream-rests')
//     eventSource.onmessage = async (event) => {
//       let tempTasks = []
//       console.log("3")
//       const newData = JSON.parse(event.data).map(item => ({
//         _id: item._id,
//         id: item.id,
//         ...item.attributes,
//         description: item.attributes.description || {} 
//       }))
//       console.log("4",newData)

//       for (let task of newData) {
//         console.log("5", task)
//         console.log(task.id)
//         const jobData = await fetchJobById(task._id)
//         if (jobData) {
//           task.job = jobData
//         }
//         tempTasks.push(task)
//       }
//       activeTasks.value = tempTasks.filter(item => item.cancel !== 'true')
//       // archivedTasks.value = tempTasks.filter(item => item.cancel === 'true')

//     }
//     eventSource.onerror = (error) => {
//       console.error('EventSource failed:', error)
//     }
//   }
// }

// const stopEventSource = () => {
//   if (eventSource) {
//     eventSource.close()
//     eventSource = null
//   }
// }

// const filterDataById = (id) => {
//   return activeTasks.value.filter(item => item.id === id)
// }

// const filterDataByAttribute = (attr, value) => {
//   return activeTasks.value.filter(item => item[attr] === value)
// }

// const useCentralEventSource = () => {
//   startEventSource()
//   onUnmounted(() => {
//     stopEventSource()
//   })
//   return { activeTasks, archivedTasks, filterDataById, filterDataByAttribute, fetchJobById }
// }

// export default useCentralEventSource



import { ref, onUnmounted } from 'vue'
const activeTasks = ref([])
const archivedTasks = ref([])
import axios from 'axios'

let eventSource = null
const startEventSource = () => {
  if (typeof window !== 'undefined' && !eventSource) {
    eventSource = new EventSource('http://192.168.1.120:8001/stream-rests')
    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data).map(item => ({
        _id: item._id,
        id: item.id,
        ...item.attributes,
        description: item.attributes.description || '' // Ensure description is included
      }))
      console.log(newData.filter(item => item.cancel !== 'true'))
      console.log(newData)
      activeTasks.value = newData.filter(item => item.cancel !== 'true')
      // archivedTasks.value = newData.filter(item => item.cancel === 'true')
    }
    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error)
    }
  }
}
const fetchJobById = async (id) => {
  try {
    const response = await axios.get(`http://127.0.0.1:3000/api/query/jobs?filter[_id][eq]=${id}`)
    return response.data.data[0]
  } catch (error) {
    console.error('Error fetching job data:', error)
    return null
  }
}

const stopEventSource = () => {
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
}
const filterDataById = (id) => {
  return activeTasks.value.filter(item => item.id === id)
}
const filterDataByAttribute = (attr, value) => {
  return activeTasks.value.filter(item => item[attr] === value)
}

const fetchArchivedTasks = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:3000/api/query/stream-logs')
    console.log(response)
    const fetchedTasks = response.data.data.map(item => ({
      _id: item._id,
      id: item.id,
      ...item.attributes,
      description: item.attributes.description || ''
    }))
    archivedTasks.value = [...fetchedTasks]
  } catch (error) {
    console.error('Error fetching archived tasks:', error)
  }
}
fetchArchivedTasks()

const useCentralEventSource = () => {
  startEventSource()
  onUnmounted(() => {
    stopEventSource()
  })
  return { activeTasks, archivedTasks, filterDataById, filterDataByAttribute, fetchJobById  }
}
export default useCentralEventSource
