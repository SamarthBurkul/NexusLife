import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import { HiCheckCircle, HiShare, HiDownload } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const institutionTypes = ['Bank', 'Hospital', 'Employer', 'Government', 'Insurance'];
const purposes = ['Loan Application', 'Employment Verification', 'Insurance Claim', 'Medical Treatment', 'Government Service'];
const allFields = ['Full Name', 'Email', 'Phone', 'Date of Birth', 'Education Degree', 'Employment Role', 'Trust Score', 'Account Created'];

export default function DataCards() {
  const { user } = useAuth();
  const [institutionType, setInstitutionType] = useState('');
  const [purpose, setPurpose] = useState('');
  const [selectedFields, setSelectedFields] = useState([]);
  const [pdfLoading, setPdfLoading] = useState(false);

  const toggleField = (f) => setSelectedFields((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    } catch {
      const el = document.createElement('textarea');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      toast.success('Link copied!');
    }
  };

  const handleDownloadPDF = async () => {
    if (pdfLoading) return;
    setPdfLoading(true);
    try {
      // Create a properly formatted PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Set font for entire document
      pdf.setFont('Helvetica');

      // Header Section
      pdf.setFontSize(24);
      pdf.setTextColor(16, 185, 129); // Cyan/Teal color
      pdf.text('NexusLife', 20, yPosition);
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.text('Universal Digital Passport', 20, yPosition + 8);
      
      // Verified badge
      pdf.setDrawColor(34, 197, 94); // Green
      pdf.setLineWidth(0.5);
      pdf.rect(150, yPosition + 2, 35, 8);
      pdf.setTextColor(34, 197, 94);
      pdf.setFontSize(9);
      pdf.text('✓ Verified', 153, yPosition + 7);
      pdf.setTextColor(0, 0, 0);

      yPosition += 20;

      // Info Section (For, Purpose)
      if (institutionType || purpose) {
        pdf.setFontSize(11);
        pdf.setTextColor(100, 100, 100);
        if (institutionType) {
          pdf.text('For: ', 20, yPosition);
          pdf.setTextColor(0, 0, 0);
          pdf.setFont('Helvetica', 'bold');
          pdf.text(institutionType, 40, yPosition);
          pdf.setFont('Helvetica', 'normal');
          pdf.setTextColor(100, 100, 100);
          yPosition += 8;
        }
        if (purpose) {
          pdf.text('Purpose: ', 20, yPosition);
          pdf.setTextColor(0, 0, 0);
          pdf.setFont('Helvetica', 'bold');
          pdf.text(purpose, 40, yPosition);
          pdf.setFont('Helvetica', 'normal');
          yPosition += 8;
        }
      }

      yPosition += 5;

      // Divider line
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.3);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);

      yPosition += 10;

      // Shared Information Card
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('Helvetica', 'bold');
      pdf.text('Shared Information', 20, yPosition);
      pdf.setFont('Helvetica', 'normal');

      yPosition += 12;

      // Card background
      pdf.setFillColor(245, 245, 247);
      pdf.rect(15, yPosition - 8, pageWidth - 30, (selectedFields.length * 10) + 15, 'F');

      // Fields in card
      pdf.setFontSize(10);
      selectedFields.forEach((field, index) => {
        const value = getFieldValue(field);
        
        // Field name
        pdf.setTextColor(80, 80, 80);
        pdf.setFont('Helvetica', 'normal');
        pdf.text(`✓ ${field}`, 25, yPosition);

        // Field value
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('Helvetica', 'bold');
        pdf.text(value, pageWidth - 30, yPosition, { align: 'right' });

        yPosition += 10;
      });

      if (selectedFields.length === 0) {
        pdf.setTextColor(150, 150, 150);
        pdf.setFont('Helvetica', 'italic');
        pdf.text('No fields selected', 25, yPosition);
        yPosition += 10;
      }

      yPosition += 5;

      // Footer info
      yPosition = pageHeight - 25;
      pdf.setFontSize(9);
      pdf.setTextColor(150, 150, 150);
      pdf.setFont('Helvetica', 'normal');
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, yPosition);
      pdf.text(`NexusLife - Your Universal Digital Passport`, 20, yPosition + 8);

      // Page number
      pdf.text(`Page 1 of 1`, pageWidth - 30, yPosition);

      pdf.save('nexuslife-data-card.pdf');
      toast.success('PDF downloaded successfully!');
    } catch(err) {
      console.error('PDF generation error:', err);
      toast.error('PDF generation failed: ' + err.message);
    } finally {
      setPdfLoading(false);
    }
  };

  const getFieldValue = (field) => {
    switch(field) {
      case 'Full Name': return user?.fullName || 'Verified';
      case 'Email': return user?.email || 'Verified';
      case 'Phone': return user?.user_profiles?.phone || '+91 9876543210';
      case 'Date of Birth': return user?.user_profiles?.date_of_birth || '01-01-1990';
      case 'Education Degree': return 'B.Tech Computer Science'; // From timeline data
      case 'Employment Role': return 'Senior Engineer at Infosys'; // From timeline data
      case 'Trust Score': return '78/100'; // Global derived score mock 
      case 'Account Created': return new Date(user?.createdAt).toLocaleDateString() || 'Today';
      default: return 'Verified securely';
    }
  };

  return (
    <div className="min-h-screen bg-dark print:bg-white">
      <style>{`
        @media print {
          nav, .sidebar, .form-section, button { display: none !important; }
          .card-preview { display: block !important; width: 100% !important; margin: 0 auto !important; box-shadow: none !important; border: 1px solid #ddd !important; }
          body { background-color: white !important; }
        }
      `}</style>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-0 md:ml-64">
          <h1 className="text-2xl font-bold text-white mb-6">Generate Data Card</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <div className="bg-card border border-gray-800 rounded-xl p-6 space-y-5 form-section">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Institution Type</label>
                <select value={institutionType} onChange={(e) => setInstitutionType(e.target.value)}
                  className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none">
                  <option value="">Select type</option>
                  {institutionTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Purpose</label>
                <select value={purpose} onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none">
                  <option value="">Select purpose</option>
                  {purposes.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Fields to Include</label>
                <div className="flex flex-wrap gap-2">
                  {allFields.map((f) => (
                    <button key={f} onClick={() => toggleField(f)}
                      className={`text-left px-3 py-2 rounded-lg text-sm transition ${selectedFields.includes(f) ? 'bg-primary/10 border border-primary text-primary' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="card-preview" id="data-card-preview">
              <motion.div className="bg-gradient-to-br from-gray-900 to-card border border-gray-700 rounded-2xl p-6 relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold"><span className="text-primary">Nexus</span><span className="text-white">Life</span></span>
                  </div>
                  <div className="flex items-center gap-1 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                    <HiCheckCircle /> Verified
                  </div>
                </div>

                {institutionType && <p className="text-gray-400 text-sm mb-1">For: <span className="text-white">{institutionType}</span></p>}
                {purpose && <p className="text-gray-400 text-sm mb-4">Purpose: <span className="text-white">{purpose}</span></p>}

                {/* Fields */}
                <div className="bg-black/20 rounded-lg p-4 backdrop-blur-sm min-h-[160px]">
                  <h3 className="text-sm font-semibold text-white mb-3 border-b border-gray-800 pb-2">Shared Information</h3>
                  {selectedFields.length > 0 ? (
                    <div className="space-y-3">
                      {selectedFields.map((f) => (
                        <div key={f} className="flex items-start justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <HiCheckCircle className="text-green-400 mt-0.5" />
                            <span className="text-gray-400">{f}</span>
                          </div>
                          <span className="text-white font-medium text-right max-w-[60%]">{getFieldValue(f)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm py-8 text-center">Select fields to generate preview</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button onClick={handleShare} disabled={selectedFields.length === 0} 
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-dark font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    <HiShare /> Share Link
                  </button>
                  <button onClick={handleDownloadPDF} disabled={selectedFields.length === 0 || pdfLoading}
                    className="flex-1 flex items-center justify-center gap-2 border border-gray-600 text-gray-300 py-3 rounded-xl hover:border-primary hover:text-primary transition text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    {pdfLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <HiDownload /> Download PDF
                      </>
                    )}
                  </button>
                </div>

                {/* Background decoration */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
