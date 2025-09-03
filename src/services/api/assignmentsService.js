const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

const TABLE_NAME = "assignment_c"

export const assignmentsService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "category_c" } }
        ]
      }
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error?.response?.data?.message)
        throw new Error(error.response.data.message)
      } else {
        console.error("Error fetching assignments:", error)
        throw error
      }
    }
  },

  getById: async (id) => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "category_c" } }
        ]
      }
      
      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message)
        throw new Error(error.response.data.message)
      } else {
        console.error(`Error fetching assignment with ID ${id}:`, error)
        throw error
      }
    }
  },

  create: async (assignmentData) => {
    try {
      const params = {
        records: [{
          Name: assignmentData.Name || assignmentData.title || assignmentData.title_c,
          course_id_c: assignmentData.course_id_c || assignmentData.courseId,
          title_c: assignmentData.title_c || assignmentData.title,
          description_c: assignmentData.description_c || assignmentData.description,
          due_date_c: assignmentData.due_date_c || assignmentData.dueDate,
          priority_c: assignmentData.priority_c || assignmentData.priority,
          status_c: assignmentData.status_c || assignmentData.status || "pending",
          grade_c: assignmentData.grade_c || assignmentData.grade,
          category_c: assignmentData.category_c || assignmentData.category
        }]
      }
      
      const response = await apperClient.createRecord(TABLE_NAME, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create assignments ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`)
            })
            if (record.message) throw new Error(record.message)
          })
        }
        
        const successfulRecords = response.results.filter(result => result.success)
        return successfulRecords[0]?.data
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment:", error?.response?.data?.message)
        throw new Error(error.response.data.message)
      } else {
        console.error("Error creating assignment:", error)
        throw error
      }
    }
  },

  update: async (id, updates) => {
    try {
      const updateData = {
        Id: parseInt(id)
      }
      
      // Map fields properly
      if (updates.Name !== undefined) updateData.Name = updates.Name
      if (updates.title !== undefined) updateData.Name = updates.title
      if (updates.course_id_c !== undefined) updateData.course_id_c = updates.course_id_c
      if (updates.courseId !== undefined) updateData.course_id_c = updates.courseId
      if (updates.title_c !== undefined) updateData.title_c = updates.title_c
      if (updates.title !== undefined) updateData.title_c = updates.title
      if (updates.description_c !== undefined) updateData.description_c = updates.description_c
      if (updates.description !== undefined) updateData.description_c = updates.description
      if (updates.due_date_c !== undefined) updateData.due_date_c = updates.due_date_c
      if (updates.dueDate !== undefined) updateData.due_date_c = updates.dueDate
      if (updates.priority_c !== undefined) updateData.priority_c = updates.priority_c
      if (updates.priority !== undefined) updateData.priority_c = updates.priority
      if (updates.status_c !== undefined) updateData.status_c = updates.status_c
      if (updates.status !== undefined) updateData.status_c = updates.status
      if (updates.grade_c !== undefined) updateData.grade_c = updates.grade_c
      if (updates.grade !== undefined) updateData.grade_c = updates.grade
      if (updates.category_c !== undefined) updateData.category_c = updates.category_c
      if (updates.category !== undefined) updateData.category_c = updates.category
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord(TABLE_NAME, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update assignments ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`)
            })
            if (record.message) throw new Error(record.message)
          })
        }
        
        const successfulUpdates = response.results.filter(result => result.success)
        return successfulUpdates[0]?.data
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment:", error?.response?.data?.message)
        throw new Error(error.response.data.message)
      } else {
        console.error("Error updating assignment:", error)
        throw error
      }
    }
  },

  delete: async (id) => {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord(TABLE_NAME, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete assignments ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        const successfulDeletions = response.results.filter(result => result.success)
        return successfulDeletions.length > 0
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting assignment:", error?.response?.data?.message)
        throw new Error(error.response.data.message)
      } else {
        console.error("Error deleting assignment:", error)
        throw error
      }
    }
  }
}