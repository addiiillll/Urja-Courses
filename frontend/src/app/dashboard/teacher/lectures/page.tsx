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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { Video, Plus, ExternalLink, BookOpen } from "lucide-react"

interface Course {
  id: number
  title: string
  description: string
  is_published: boolean
}

interface Lecture {
  id: number
  course_id: number
  title: string
  video_url: string
  course_title?: string
}

export default function TeacherLectures() {
  const [courses, setCourses] = useState<Course[]>([])
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
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
    }
  }

  const fetchAllLectures = async () => {
    try {
      const token = localStorage.getItem('token')
      const allLectures: Lecture[] = []

      for (const course of courses) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${course.id}/lectures`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const courseLectures = await response.json()
          const lecturesWithCourse = courseLectures.map((lecture: Lecture) => ({
            ...lecture,
            course_title: course.title
          }))
          allLectures.push(...lecturesWithCourse)
        }
      }

      setLectures(allLectures)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch lectures')
    } finally {
      setIsLoading(false)
    }
  }

  const addLecture = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const courseId = formData.get('course_id') as string
    const title = formData.get('title') as string
    const video_url = formData.get('video_url') as string

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/lectures`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, video_url }),
      })

      if (!response.ok) throw new Error('Failed to add lecture')
      setIsAddLectureOpen(false)
      fetchAllLectures()
      e.currentTarget.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add lecture')
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (courses.length > 0) {
      fetchAllLectures()
    }
  }, [courses])

  const AddLectureForm = () => (
    <form onSubmit={addLecture} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="course_id">Select Course</Label>
        <Select name="course_id" required>
          <SelectTrigger>
            <SelectValue placeholder="Choose a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id.toString()}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Lecture Title</Label>
        <Input id="title" name="title" placeholder="Enter lecture title" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="video_url">Video URL</Label>
        <Input id="video_url" name="video_url" type="url" placeholder="https://example.com/video" required />
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
                <BreadcrumbPage>Lectures</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">My Lectures</h1>
          <p className="text-muted-foreground">Manage all your lectures across courses</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Lectures</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lectures.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg per Course</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {courses.length > 0 ? Math.round(lectures.length / courses.length) : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Lecture Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Lectures by Course</h2>
          {isMobile ? (
            <Drawer open={isAddLectureOpen} onOpenChange={setIsAddLectureOpen}>
              <DrawerTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Add Lecture</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Add New Lecture</DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                  <AddLectureForm />
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <Dialog open={isAddLectureOpen} onOpenChange={setIsAddLectureOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Add Lecture</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Lecture</DialogTitle>
                </DialogHeader>
                <AddLectureForm />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Lectures Grouped by Course */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading lectures...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-red-600">{error}</div>
          </div>
        ) : lectures.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No lectures yet. Add your first lecture!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {courses.map((course) => {
              const courseLectures = lectures.filter(lecture => lecture.course_id === course.id)
              if (courseLectures.length === 0) return null
              
              return (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl">{course.title}</CardTitle>
                        <Badge variant={course.is_published ? "default" : "secondary"}>
                          {course.is_published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <Badge variant="outline">
                        {courseLectures.length} lecture{courseLectures.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{course.description}</p>
                  </CardHeader>
                  <CardContent>
                    {courseLectures.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No lectures in this course yet
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {courseLectures.map((lecture) => (
                          <Card key={lecture.id} className="border-muted">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">{lecture.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 space-y-3">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Video className="h-4 w-4" />
                                <span>Video Lecture</span>
                              </div>
                              
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => window.open(lecture.video_url, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3 mr-2" />
                                Watch Video
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}