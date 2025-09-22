import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Search,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Filter,
  BarChart3,
  Users,
  TrendingUp,
  Activity
} from 'lucide-react'
import { ContactService, type Contact, type ContactFilters } from '@/lib/contactServiceNew'
import { AdminNav } from '@/components/admin/AdminNav'

const ContactManagement: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [statistics, setStatistics] = useState<any>(null)
  
  // Filters
  const [filters, setFilters] = useState<ContactFilters>({
    status: undefined,
    subject: undefined,
    search: undefined,
    limit: 50,
    offset: 0
  })
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [subjectFilter, setSubjectFilter] = useState<string>('all')

  const loadContacts = async () => {
    try {
      setError(null)
      const activeFilters: ContactFilters = {
        status: statusFilter === 'all' ? undefined : (statusFilter as any),
        subject: subjectFilter === 'all' ? undefined : subjectFilter,
        search: searchTerm.trim() || undefined,
        limit: 50,
        offset: 0
      }
      
      const data = await ContactService.getContacts(activeFilters)
      setContacts(data)
    } catch (err) {
      console.error('Error loading contacts:', err)
      setError('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  const loadStatistics = async () => {
    try {
      const stats = await ContactService.getContactStatistics()
      setStatistics(stats)
    } catch (err) {
      console.error('Error loading statistics:', err)
    }
  }

  useEffect(() => {
    loadContacts()
    loadStatistics()
  }, [statusFilter, subjectFilter])

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== filters.search) {
        loadContacts()
      }
    }, 500)

    return () => clearTimeout(delayedSearch)
  }, [searchTerm])

  const handleStatusUpdate = async (contactId: string, newStatus: Contact['status']) => {
    try {
      await ContactService.updateContactStatus(contactId, newStatus)
      await loadContacts()
      await loadStatistics()
      
      // Update selected contact if it's open
      if (selectedContact?.id === contactId) {
        setSelectedContact(prev => prev ? { ...prev, status: newStatus, updated_at: new Date().toISOString() } : null)
      }
    } catch (err) {
      console.error('Error updating contact status:', err)
      setError('Failed to update contact status')
    }
  }

  const handleDelete = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      return
    }

    try {
      await ContactService.deleteContact(contactId)
      await loadContacts()
      await loadStatistics()
      
      if (selectedContact?.id === contactId) {
        setSelectedContact(null)
        setDialogOpen(false)
      }
    } catch (err) {
      console.error('Error deleting contact:', err)
      setError('Failed to delete contact')
    }
  }

  const getStatusBadge = (status: Contact['status']) => {
    switch (status) {
      case 'new':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">New</Badge>
      case 'in_progress':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      case 'resolved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Resolved</Badge>
      case 'closed':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Closed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSubjectOptions = () => {
    const subjects = Array.from(new Set(contacts.map(c => c.subject).filter(Boolean))).sort()
    return subjects
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Management</h1>
          <p className="text-gray-600">Manage and respond to customer inquiries</p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                    <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">New Messages</p>
                    <p className="text-2xl font-bold text-blue-600">{statistics.byStatus?.new || 0}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-yellow-600">{statistics.byStatus?.in_progress || 0}</p>
                  </div>
                  <Activity className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Recent (7 days)</p>
                    <p className="text-2xl font-bold text-green-600">{statistics.recent || 0}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {getSubjectOptions().map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={loadContacts}
                  variant="outline"
                  size="icon"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Contacts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">Loading contacts...</span>
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No contacts found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{contact.name}</p>
                            <p className="text-sm text-gray-500">{contact.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{contact.subject}</span>
                        </TableCell>
                        <TableCell>{getStatusBadge(contact.status)}</TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-500">
                            {formatDate(contact.created_at)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog open={dialogOpen && selectedContact?.id === contact.id} onOpenChange={(open) => {
                              if (open) {
                                setSelectedContact(contact)
                                setDialogOpen(true)
                              } else {
                                setDialogOpen(false)
                                setSelectedContact(null)
                              }
                            }}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Contact Details</DialogTitle>
                                </DialogHeader>
                                {selectedContact && (
                                  <div className="space-y-6">
                                    {/* Contact Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Name</label>
                                        <p className="text-gray-900">{selectedContact.name}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Email</label>
                                        <div className="flex items-center gap-2">
                                          <p className="text-gray-900">{selectedContact.email}</p>
                                          <a
                                            href={`mailto:${selectedContact.email}`}
                                            className="text-emerald-600 hover:text-emerald-700"
                                          >
                                            <Mail className="w-4 h-4" />
                                          </a>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Phone</label>
                                        <div className="flex items-center gap-2">
                                          <p className="text-gray-900">{selectedContact.phone}</p>
                                          <a
                                            href={`tel:${selectedContact.phone}`}
                                            className="text-emerald-600 hover:text-emerald-700"
                                          >
                                            <Phone className="w-4 h-4" />
                                          </a>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Subject</label>
                                        <p className="text-gray-900">{selectedContact.subject}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Status</label>
                                        <div className="mt-1">{getStatusBadge(selectedContact.status)}</div>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Created</label>
                                        <p className="text-gray-900">{formatDate(selectedContact.created_at)}</p>
                                      </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Message</label>
                                      <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                                        <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                                      </div>
                                    </div>

                                    {/* Status Update */}
                                    <div>
                                      <label className="text-sm font-medium text-gray-600 mb-2 block">Update Status</label>
                                      <div className="flex gap-2">
                                        <Button
                                          onClick={() => handleStatusUpdate(selectedContact.id, 'new')}
                                          variant={selectedContact.status === 'new' ? 'default' : 'outline'}
                                          size="sm"
                                          className={selectedContact.status === 'new' ? 'bg-blue-600' : ''}
                                        >
                                          New
                                        </Button>
                                        <Button
                                          onClick={() => handleStatusUpdate(selectedContact.id, 'in_progress')}
                                          variant={selectedContact.status === 'in_progress' ? 'default' : 'outline'}
                                          size="sm"
                                          className={selectedContact.status === 'in_progress' ? 'bg-yellow-600' : ''}
                                        >
                                          In Progress
                                        </Button>
                                        <Button
                                          onClick={() => handleStatusUpdate(selectedContact.id, 'resolved')}
                                          variant={selectedContact.status === 'resolved' ? 'default' : 'outline'}
                                          size="sm"
                                          className={selectedContact.status === 'resolved' ? 'bg-green-600' : ''}
                                        >
                                          Resolved
                                        </Button>
                                        <Button
                                          onClick={() => handleStatusUpdate(selectedContact.id, 'closed')}
                                          variant={selectedContact.status === 'closed' ? 'default' : 'outline'}
                                          size="sm"
                                          className={selectedContact.status === 'closed' ? 'bg-gray-600' : ''}
                                        >
                                          Closed
                                        </Button>
                                      </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-between pt-4 border-t">
                                      <Button
                                        onClick={() => handleDelete(selectedContact.id)}
                                        variant="destructive"
                                        size="sm"
                                      >
                                        Delete Contact
                                      </Button>
                                      <div className="flex gap-2">
                                        <Button
                                          onClick={() => window.open(`mailto:${selectedContact.email}`)}
                                          variant="outline"
                                          size="sm"
                                        >
                                          <Mail className="w-4 h-4 mr-2" />
                                          Reply via Email
                                        </Button>
                                        <Button
                                          onClick={() => window.open(`tel:${selectedContact.phone}`)}
                                          variant="outline"
                                          size="sm"
                                        >
                                          <Phone className="w-4 h-4 mr-2" />
                                          Call
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            {/* Quick Status Actions */}
                            {contact.status === 'new' && (
                              <Button
                                onClick={() => handleStatusUpdate(contact.id, 'in_progress')}
                                variant="outline"
                                size="sm"
                                className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                              >
                                <Clock className="w-4 h-4" />
                              </Button>
                            )}
                            {contact.status === 'in_progress' && (
                              <Button
                                onClick={() => handleStatusUpdate(contact.id, 'resolved')}
                                variant="outline"
                                size="sm"
                                className="text-green-600 border-green-200 hover:bg-green-50"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ContactManagement