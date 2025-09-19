import React from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { User, Phone, Calendar, Hash, Download, Share2 } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface ECardProps {
  patient: {
    seniorCareId: string
    name: string
    dateOfBirth: string
    sex: string
    phoneNumber: string
  }
}

export function ECard({ patient }: ECardProps) {
  const handleDownload = async () => {
    try {
      // Get the e-card element
      const element = document.getElementById(`ecard-${patient.seniorCareId}`)
      if (!element) {
        console.error('E-card element not found')
        return
      }

      // Convert the element to canvas
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        logging: false
      })

      // Create PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Calculate dimensions to fit the e-card properly
      const imgWidth = 180 // Width in mm for A4
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Center the image on the page
      const x = (210 - imgWidth) / 2 // A4 width is 210mm
      const y = 20 // Top margin

      // Add the image to PDF
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight)
      
      // Add title
      pdf.setFontSize(16)
      pdf.setTextColor(0, 0, 0)
      pdf.text('SeniorCare Plus E-Card', 105, 15, { align: 'center' })

      // Download the PDF
      pdf.save(`SeniorCare_Plus_ECard_${patient.seniorCareId}.pdf`)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to download E-card. Please try again.')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SeniorCare Plus E-Card',
        text: `SeniorCare ID: ${patient.seniorCareId}\nName: ${patient.name}`,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `SeniorCare Plus E-Card\nID: ${patient.seniorCareId}\nName: ${patient.name}\nPhone: ${patient.phoneNumber}`
      )
      alert('E-card details copied to clipboard!')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card 
        id={`ecard-${patient.seniorCareId}`}
        className="bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-2xl border-0 overflow-hidden"
      >
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-white/20 backdrop-blur-sm p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <img 
                src="/logo.svg" 
                alt="SeniorCare Plus" 
                className="h-8 w-auto filter brightness-0 invert"
              />
            </div>
            <h2 className="text-lg font-bold">SeniorCare Plus</h2>
            <p className="text-sm opacity-90">Healthcare E-Card</p>
          </div>

          {/* Patient Info */}
          <div className="p-6 space-y-4">
            {/* Senior Care ID - Most Prominent */}
            <div className="text-center bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-center mb-2">
                <Hash className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Senior Care ID</span>
              </div>
              <div className="text-2xl font-bold tracking-wider">
                {patient.seniorCareId}
              </div>
            </div>

            {/* Patient Details */}
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-3 opacity-80" />
                <div>
                  <p className="text-xs opacity-80">Name</p>
                  <p className="font-semibold">{patient.name}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-3 opacity-80" />
                <div>
                  <p className="text-xs opacity-80">Date of Birth</p>
                  <p className="font-semibold">
                    {new Date(patient.dateOfBirth).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <User className="h-4 w-4 mr-3 opacity-80" />
                <div>
                  <p className="text-xs opacity-80">Gender</p>
                  <p className="font-semibold capitalize">{patient.sex}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-3 opacity-80" />
                <div>
                  <p className="text-xs opacity-80">Phone Number</p>
                  <p className="font-semibold">{patient.phoneNumber}</p>
                </div>
              </div>
            </div>

            {/* Login Instructions */}
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-center opacity-90">
                <strong>Login Instructions:</strong><br />
                Use your Senior Care ID or Phone Number<br />
                along with your Date of Birth to login
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white/10 p-3 text-center">
            <p className="text-xs opacity-80">
              Valid from {new Date().toLocaleDateString('en-IN')}
            </p>
            <p className="text-xs opacity-60">
              24/7 Emergency Support: 1800-XXX-XXXX
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        <Button
          onClick={handleDownload}
          variant="outline"
          className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  )
}