const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

const TABLE_NAME = "grade_c"

export const gradesService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "current_grade_c" } },
          { field: { Name: "letter_grade_c" } },
          { field: { Name: "categories_c" } },
          { field: { Name: "assignments_c" } }
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
        console.error("Error fetching grades:", error?.response?.data?.message)
        throw new Error(error.response.data.message)
      } else {
        console.error("Error fetching grades:", error)
        throw error
      }
    }
  },

  getById: async (courseId) => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "current_grade_c" } },
          { field: { Name: "letter_grade_c" } },
          { field: { Name: "categories_c" } },
          { field: { Name: "assignments_c" } }
        ],
        where: [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ]
      }
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (!response.data || response.data.length === 0) {
        throw new Error("Grade not found")
      }
      
      return response.data[0]
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching grade for course ID ${courseId}:`, error?.response?.data?.message)
        throw new Error(error.response.data.message)
      } else {
        console.error(`Error fetching grade for course ID ${courseId}:`, error)
        throw error
      }
    }
  },

  create: async (gradeData) => {
    try {
      const params = {
        records: [{
          Name: gradeData.Name || `Grade for Course ${gradeData.course_id_c || gradeData.courseId}`,
          course_id_c: gradeData.course_id_c || gradeData.courseId,
          current_grade_c: gradeData.current_grade_c || gradeData.currentGrade,
          letter_grade_c: gradeData.letter_grade_c || gradeData.letterGrade,
          categories_c: JSON.stringify(gradeData.categories_c || gradeData.categories),
          assignments_c: JSON.stringify(gradeData.assignments_c || gradeData.assignments)
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
          console.error(`Failed to create grades ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
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
        console.error("Error creating grade:", error?.response?.data?.message)
        throw new Error(error.response.data.message)
      } else {
        console.error("Error creating grade:", error)
        throw error
      }
    }
  },

  update: async (courseId, updates) => {
    try {
      // First find the grade record by courseId
      const existingGrade = await this.getById(courseId)
      if (!existingGrade) {
        throw new Error("Grade not found")
      }
      
      const updateData = {
        Id: existingGrade.Id
      }
      
      // Map fields properly
      if (updates.Name !== undefined) updateData.Name = updates.Name
      if (updates.course_id_c !== undefined) updateData.course_id_c = updates.course_id_c
      if (updates.courseId !== undefined) updateData.course_id_c = updates.courseId
      if (updates.current_grade_c !== undefined) updateData.current_grade_c = updates.current_grade_c
      if (updates.currentGrade !== undefined) updateData.current_grade_c = updates.currentGrade
      if (updates.letter_grade_c !== undefined) updateData.letter_grade_c = updates.letter_grade_c
      if (updates.letterGrade !== undefined) updateData.letter_grade_c = updates.letterGrade
      if (updates.categories_c !== undefined) updateData.categories_c = JSON.stringify(updates.categories_c)
      if (updates.categories !== undefined) updateData.categories_c = JSON.stringify(updates.categories)
      if (updates.assignments_c !== undefined) updateData.assignments_c = JSON.stringify(updates.assignments_c)
      if (updates.assignments !== undefined) updateData.assignments_c = JSON.stringify(updates.assignments)
      
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
          console.error(`Failed to update grades ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
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
        console.error("Error updating grade:", error?.response?.data?.message)
        throw new Error(error.response.data.message)
      } else {
        console.error("Error updating grade:", error)
        throw error
      }
    }
  },

  delete: async (courseId) => {
    try {
      // First find the grade record by courseId
      const existingGrade = await this.getById(courseId)
      if (!existingGrade) {
        throw new Error("Grade not found")
      }
      
      const params = {
        RecordIds: [existingGrade.Id]
      }
      
      const response = await apperClient.deleteRecord(TABLE_NAME, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete grades ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        const successfulDeletions = response.results.filter(result => result.success)
        return successfulDeletions.length > 0
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grade:", error?.response?.data?.message)
        throw new Error(error.response.data.message)
      } else {
        console.error("Error deleting grade:", error)
        throw error
      }
    }
}
};