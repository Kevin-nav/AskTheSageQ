"use client"

import AdminDataTable from "./admin-data-table"

const mockStudentData = [
  {
    id: "STU001",
    name: "Kwame Asante",
    program: "Computer Science",
    performanceScore: 92,
    status: "Active",
    lastActive: "2024-01-15",
  },
  {
    id: "STU002",
    name: "Ama Osei",
    program: "Mathematics",
    performanceScore: 88,
    status: "Active",
    lastActive: "2024-01-14",
  },
  {
    id: "STU003",
    name: "Kofi Mensah",
    program: "Physics",
    performanceScore: 95,
    status: "Active",
    lastActive: "2024-01-15",
  },
  {
    id: "STU004",
    name: "Akosua Boateng",
    program: "Chemistry",
    performanceScore: 87,
    status: "Inactive",
    lastActive: "2024-01-10",
  },
  {
    id: "STU005",
    name: "Yaw Oppong",
    program: "Computer Science",
    performanceScore: 91,
    status: "Active",
    lastActive: "2024-01-15",
  },
  {
    id: "STU006",
    name: "Efua Darko",
    program: "Mathematics",
    performanceScore: 89,
    status: "Active",
    lastActive: "2024-01-13",
  },
  {
    id: "STU007",
    name: "Kwaku Owusu",
    program: "Physics",
    performanceScore: 93,
    status: "Active",
    lastActive: "2024-01-14",
  },
  {
    id: "STU008",
    name: "Adwoa Frimpong",
    program: "Chemistry",
    performanceScore: 86,
    status: "Active",
    lastActive: "2024-01-15",
  },
  {
    id: "STU009",
    name: "Kojo Antwi",
    program: "Computer Science",
    performanceScore: 94,
    status: "Active",
    lastActive: "2024-01-15",
  },
  {
    id: "STU010",
    name: "Abena Gyasi",
    program: "Mathematics",
    performanceScore: 90,
    status: "Active",
    lastActive: "2024-01-12",
  },
  {
    id: "STU011",
    name: "Fiifi Tetteh",
    program: "Physics",
    performanceScore: 85,
    status: "Inactive",
    lastActive: "2024-01-08",
  },
  {
    id: "STU012",
    name: "Nana Ama",
    program: "Chemistry",
    performanceScore: 92,
    status: "Active",
    lastActive: "2024-01-15",
  },
]

const columns = [
  { key: "id", header: "Student ID", sortable: true },
  { key: "name", header: "Name", sortable: true },
  { key: "program", header: "Program", sortable: true },
  { key: "performanceScore", header: "Performance Score", sortable: true },
  { key: "status", header: "Status", sortable: true },
  { key: "lastActive", header: "Last Active", sortable: true },
]

export default function StudentsTable() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-forest-green mb-2">Students Management</h2>
        <p className="text-slate-600">Manage and monitor student performance and engagement</p>
      </div>

      <AdminDataTable data={mockStudentData} columns={columns} itemsPerPage={8} searchable={true} />
    </div>
  )
}
