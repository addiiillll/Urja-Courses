"use client"

import { useEffect, useState } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { BookOpen, Video, Plus, Eye, EyeOff } from "lucide-react"

interface Course {
  id: number
  title: string
  description: string
  is_published: boolean
}

interface Lecture {
  id: number
  title: string
  video_url: string
}

export default function TeacherDashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [lectures, setLectures] = useState<{ [courseId: number]: Lecture[] }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false)
  const [isAddLectureOpen, setIsAddLectureOpen] = useState(false)
  const isMobile = useIsMobile()

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) throw new Error('Failed to fetch courses')
      const data = await response.json()
      setCourses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLectures = async (courseId: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/lectures`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) throw new Error('Failed to fetch lectures')
      const data = await response.json()
      setLectures(prev => ({ ...prev, [courseId]: data }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch lectures')
    }
  }

  const createCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      })

      if (!response.ok) throw new Error('Failed to create course')
      setIsCreateCourseOpen(false)
      fetchCourses()
      e.currentTarget.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course')
    }
  }

  const addLecture = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedCourse) return

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const video_url = formData.get('video_url') as string

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${selectedCourse}/lectures`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, video_url }),
      })

      if (!response.ok) throw new Error('Failed to add lecture')
      setIsAddLectureOpen(false)
      fetchLectures(selectedCourse)
      e.currentTarget.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add lecture')
    }
  }

  const handleViewLectures = (courseId: number) => {
    if (!lectures[courseId]) {
      fetchLectures(courseId)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const publishedCourses = courses.filter(course => course.is_published).length
  const totalLectures = Object.values(lectures).reduce((sum, courseLectures) => sum + courseLectures.length, 0)

  const CreateCourseForm = () => (
    <form onSubmit={createCourse} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Course Title</Label>
        <Input id="title" name="title" placeholder="Enter course title" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" placeholder="Enter course description" required />
      </div>
      <Button type="submit" className="w-full">Create Course</Button>
    </form>
  )

  const AddLectureForm = () => (
    <form onSubmit={addLecture} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="lecture-title">Lecture Title</Label>
        <Input id="lecture-title" name="title" placeholder="Enter lecture title" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="video-url">Video URL</Label>
        <Input id="video-url" name="video_url" type="url" placeholder="https://example.com/video" required />
      </div>
      <Button type="submit" className="w-full">Add Lecture</Button>
    </form>
  )

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard/teacher">Teacher Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>My Courses</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-muted-foreground">Manage your courses and lectures</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Lectures</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLectures}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedCourses}</div>
            </CardContent>
          </Card>
        </div>

        {/* Create Course Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Course List</h2>
          {isMobile ? (
            <Drawer open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
              <DrawerTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Create Course</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Create New Course</DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                  <CreateCourseForm />
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Create Course</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Course</DialogTitle>
                </DialogHeader>
                <CreateCourseForm />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading courses...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-red-600">{error}</div>
          </div>
        ) : courses.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No courses yet. Create your first course!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <Badge variant={course.is_published ? "default" : "secondary"}>
                      {course.is_published ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                      {course.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  
                  {lectures[course.id] && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Lectures ({lectures[course.id].length})</h4>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {lectures[course.id].map((lecture) => (
                          <div key={lecture.id} className="text-xs p-2 bg-muted rounded">
                            {lecture.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewLectures(course.id)}
                      className="flex-1"
                    >
                      <Video className="h-3 w-3 mr-1" />
                      View Lectures
                    </Button>
                    
                    {isMobile ? (
                      <Drawer open={isAddLectureOpen && selectedCourse === course.id} onOpenChange={(open) => {
                        setIsAddLectureOpen(open)
                        if (open) setSelectedCourse(course.id)
                      }}>
                        <DrawerTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedCourse(course.id)}>
                            <Plus className="h-3 w-3 mr-1" />Add
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>Add Lecture to {course.title}</DrawerTitle>
                          </DrawerHeader>
                          <div className="p-4">
                            <AddLectureForm />
                          </div>
                        </DrawerContent>
                      </Drawer>
                    ) : (
                      <Dialog open={isAddLectureOpen && selectedCourse === course.id} onOpenChange={(open) => {
                        setIsAddLectureOpen(open)
                        if (open) setSelectedCourse(course.id)
                      }}>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedCourse(course.id)}>
                            <Plus className="h-3 w-3 mr-1" />Add
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Lecture to {course.title}</DialogTitle>
                          </DialogHeader>
                          <AddLectureForm />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
