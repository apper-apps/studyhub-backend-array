const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

const TABLE_NAME = "course_c"

export const coursesService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "professor_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "semester_c" } },
          { field: { Name: "grade_categories_c" } }
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
        console.error("Error fetching courses:", error?.response?.data?.message)
        throw new Error(error.response.data.message)
      } else {
        console.error("Error fetching courses:", error)
        throw error
      }
    }
  },

  getById: async (id) => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "professor_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "semester_c" } },
          { field: { Name: "grade_categories_c" } }
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
        console.error(`Error fetching course with ID ${id}:`, error?.response?.data?.message)
        throw new Error(error.response.data.message)
      } else {
        console.error(`Error fetching course with ID ${id}:`, error)
        throw error
      }
    }
  },

  create: async (courseData) => {
    try {
      const params = {
        records: [{
          Name: courseData.Name || courseData.name,
          professor_c: courseData.professor_c || courseData.professor,
          credits_c: courseData.credits_c || courseData.credits,
          color_c: courseData.color_c || courseData.color,
          schedule_c: JSON.stringify(courseData.schedule_c || courseData.schedule),
          semester_c: courseData.semester_c || courseData.semester,
          grade_categories_c: JSON.stringify(courseData.grade_categories_c || courseData.gradeCategories)
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
          console.error(`Failed to create courses ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
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
        console.error("Error creating course:", error?.response?.data?.message)
        throw new Error(error.response.data.message)
      } else {
        console.error("Error creating course:", error)
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
      if (updates.name !== undefined) updateData.Name = updates.name
      if (updates.professor_c !== undefined) updateData.professor_c = updates.professor_c
      if (updates.professor !== undefined) updateData.professor_c = updates.professor
      if (updates.credits_c !== undefined) updateData.credits_c = updates.credits_c
      if (updates.credits !== undefined) updateData.credits_c = updates.credits
      if (updates.color_c !== undefined) updateData.color_c = updates.color_c
      if (updates.color !== undefined) updateData.color_c = updates.color
      if (updates.schedule_c !== undefined) updateData.schedule_c = JSON.stringify(updates.schedule_c)
      if (updates.schedule !== undefined) updateData.schedule_c = JSON.stringify(updates.schedule)
      if (updates.semester_c !== undefined) updateData.semester_c = updates.semester_c
      if (updates.semester !== undefined) updateData.semester_c = updates.semester
      if (updates.grade_categories_c !== undefined) updateData.grade_categories_c = JSON.stringify(updates.grade_categories_c)
      if (updates.gradeCategories !== undefined) updateData.grade_categories_c = JSON.stringify(updates.gradeCategories)
      
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
          console.error(`Failed to update courses ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
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
        console.error("Error updating course:", error?.response?.data?.message)
        throw new Error(error.response.data.message)
      } else {
        console.error("Error updating course:", error)
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
          console.error(`Failed to delete courses ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        const successfulDeletions = response.results.filter(result => result.success)
        return successfulDeletions.length > 0
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting course:", error?.response?.data?.message)
        throw new Error(error.response.data.message)
      } else {
        console.error("Error deleting course:", error)
        throw error
      }
    }
  }
}