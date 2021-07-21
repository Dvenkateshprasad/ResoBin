import debounce from 'lodash.debounce'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { CourseList, CourseSearch } from 'components/courses'
import { FilterAside } from 'components/filter'
import { useViewportContext } from 'context/ViewportContext'
import { search as applySearch, searchAsync } from 'helpers'
import {
  selectCourseSearch,
  selectCourseList,
  setSearch,
} from 'store/courseSlice'
import { breakpoints } from 'styles/responsive'

const Container = styled.div`
  width: 100%;
  min-height: calc(100vh - ${({ theme }) => theme.headerHeight});
`

const searchFields = ['Code', 'Title', 'Description']

const CourseBody = ({ showFilters: showFilter, onClick }) => {
  // ? responsive layout state
  const { width } = useViewportContext()

  // ? total course data
  const courseData = useSelector(selectCourseList)
  const search = useSelector(selectCourseSearch)

  // ? filtered course data
  const [courseDataFiltered, setCourseDataFiltered] = useState(courseData)

  // ? search input state
  const dispatch = useDispatch()
  const handleChange = (event) => dispatch(setSearch(event.currentTarget.value))

  // ? loading status while searching
  const [loadingSearch, setLoadingSearch] = useState(false)

  // debounce(this.runSearch, 200)
  useEffect(() => {
    const searchCourses = async (keyword) => {
      setLoadingSearch(true)

      await setTimeout(() => {
        setCourseDataFiltered(
          applySearch({
            data: courseData,
            keyword,
            keys: searchFields,
          })
        )
        setLoadingSearch(false)
      }, 400)
    }

    if (search) searchCourses(search)
    else setCourseDataFiltered(courseData)
  }, [search, courseData])

  const loading = loadingSearch

  return (
    <Container>
      <CourseSearch
        loading={loading}
        value={search}
        onChange={handleChange}
        showFilter={width < breakpoints.lg && showFilter}
        filterState={null}
      />
      <FilterAside FilterDropdown showFilters={width >= breakpoints.lg} />

      <CourseList courses={courseDataFiltered} loading={loading} />
    </Container>
  )
}

export default CourseBody
