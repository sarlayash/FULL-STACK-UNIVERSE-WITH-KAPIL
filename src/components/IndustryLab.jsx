import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INDUSTRY_MVPS } from '../data/industryProjectsData';
import { 
  Layers, 
  ShoppingCart, 
  Landmark, 
  HeartPulse, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  Database, 
  GitBranch, 
  Server, 
  ShieldCheck, 
  Play, 
  CreditCard, 
  Plus, 
  Clock, 
  DollarSign, 
  Send,
  Terminal,
  FileCode
} from 'lucide-react';

export const IndustryLab = () => {
  const { activeTrack } = useApp();
  const [selectedMvpId, setSelectedMvpId] = useState('shopsphere');
  const [activeSubTab, setActiveSubTab] = useState('demo'); // 'demo' | 'architecture' | 'schema' | 'api'

  // Interactive Live State for ShopSphere
  const [cartItems, setCartItems] = useState([
    { id: 'prod-1', name: 'AeroBuds Pro Noise Canceling', price: 129.99, qty: 1 }
  ]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Interactive Live State for FinCore
  const [fincoreAccounts, setFincoreAccounts] = useState([
    { id: 'acc-1', name: 'Alex Sharma (Demo Student)', accNo: 'IN4592001928', balance: 28389.98 },
    { id: 'acc-2', name: 'Campus Cafeteria Vendors', accNo: 'IN9982716254', balance: 145200.50 }
  ]);
  const [transferAmount, setTransferAmount] = useState('500.00');
  const [transferLedger, setTransferLedger] = useState([
    { id: 'TX-9801', desc: 'Semester Mess Fee', debit: 4500.00, credit: 0, date: '22 Sept 2026', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' }
  ]);
  const [transferNotice, setTransferNotice] = useState('');

  // Interactive Live State for MediFlow
  const [appointments, setAppointments] = useState([
    { id: 'APT-101', doctor: 'Dr. Aditi Mukherjee, MD (Cardiology)', patient: 'Alex Sharma', time: '10:30 AM', token: 14, status: 'SCHEDULED' }
  ]);
  const [bookedPatient, setBookedPatient] = useState('Priya Patel');

  // Interactive Live State for CampusOS
  const [assignments, setAssignments] = useState([
    { id: 'ASG-1', course: 'CS401 Distributed Systems', title: 'Spring Boot Saga Orchestrator', submitted: true, grade: '96/100' },
    { id: 'ASG-2', course: 'CS402 High-Concurrency Backends', title: 'FastAPI Async Token Bucket', submitted: false, grade: 'Pending' }
  ]);

  const activeMvp = INDUSTRY_MVPS.find(m => m.id === selectedMvpId) || INDUSTRY_MVPS[0];

  // Handlers for ShopSphere
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const simulateCheckout = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      setCartItems([]);
      setPaymentSuccess(false);
    }, 3000);
  };

  // Handlers for FinCore
  const executeTransfer = (e) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0 || amt > fincoreAccounts[0].balance) {
      setTransferNotice('Invalid transfer amount or insufficient balance!');
      return;
    }

    setFincoreAccounts(prev => [
      { ...prev[0], balance: prev[0].balance - amt },
      { ...prev[1], balance: prev[1].balance + amt }
    ]);

    const newTxId = 'TX-' + Math.floor(1000 + Math.random() * 9000);
    setTransferLedger(prev => [
      {
        id: newTxId,
        desc: `P2P Transfer to ${fincoreAccounts[1].name}`,
        debit: amt,
        credit: 0,
        date: 'Just now',
        hash: `sha256_${Math.random().toString(36).substring(2, 12)}...`
      },
      ...prev
    ]);

    setTransferNotice(`₹${amt.toFixed(2)} transferred successfully with strict ACID serializable transaction!`);
    setTimeout(() => setTransferNotice(''), 4000);
  };

  // Handlers for MediFlow
  const bookAppointment = () => {
    const newApt = {
      id: 'APT-' + Math.floor(100 + Math.random() * 900),
      doctor: 'Dr. Rajesh Verma, MS (Orthopedics)',
      patient: bookedPatient,
      time: '11:15 AM',
      token: appointments.length + 15,
      status: 'CONFIRMED'
    };
    setAppointments(prev => [newApt, ...prev]);
  };

  // Handlers for CampusOS
  const submitAssignment = (id) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, submitted: true, grade: '92/100 (Automated Tests Passed)' } : a));
  };

  const totalCartValue = cartItems.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30 mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>INDUSTRY LAB · 4 FULL-STACK PRODUCTION MVPS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Domain MVPs & Architecture Blueprints
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Real enterprise applications with interactive working simulators, database schemas, REST APIs, and system design flows.
          </p>
        </div>

        {/* Domain Tabs */}
        <div className="flex flex-wrap gap-2">
          {INDUSTRY_MVPS.map((mvp) => {
            const isSelected = selectedMvpId === mvp.id;
            return (
              <button
                key={mvp.id}
                onClick={() => {
                  setSelectedMvpId(mvp.id);
                  setActiveSubTab('demo');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {mvp.id === 'shopsphere' && <ShoppingCart className="w-3.5 h-3.5" />}
                {mvp.id === 'fincore' && <Landmark className="w-3.5 h-3.5" />}
                {mvp.id === 'mediflow' && <HeartPulse className="w-3.5 h-3.5" />}
                {mvp.id === 'campusos' && <GraduationCap className="w-3.5 h-3.5" />}
                <span>{mvp.id.charAt(0).toUpperCase() + mvp.id.slice(1)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MVP Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                {activeMvp.badge}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {activeMvp.level}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {activeMvp.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {activeMvp.shortDesc}
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1.5 shrink-0">
            <div className="text-slate-500 uppercase text-[10px]">Active Stack ({activeTrack})</div>
            <div className="flex flex-wrap gap-1.5 max-w-xs">
              {(activeMvp.techStack[activeTrack] || activeMvp.techStack.java).map((tech, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-sky-400 text-[11px]">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sub Navigation (Live Demo, Architecture, Database Schema, REST API) */}
        <div className="flex overflow-x-auto gap-2 border-t border-slate-800 mt-6 pt-4">
          {[
            { id: 'demo', label: 'Live Functional MVP Simulator', icon: Play },
            { id: 'architecture', label: 'System Architecture Blueprint', icon: Server },
            { id: 'schema', label: 'Database ER Schema', icon: Database },
            { id: 'api', label: 'REST API Specification', icon: FileCode }
          ].map(tab => {
            const Icon = tab.icon;
            const isTabActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isTabActive
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Live Functional MVP Simulator */}
      {activeSubTab === 'demo' && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          
          {/* ShopSphere Live Demo */}
          {selectedMvpId === 'shopsphere' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-sky-400" />
                    <span>ShopSphere Storefront & Cart Engine</span>
                  </h3>
                  <p className="text-xs text-slate-400">Interactive live simulation with inventory lock and payment sandbox</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono text-sky-400">
                  <span>Cart: {cartItems.reduce((a, c) => a + c.qty, 0)} items</span>
                  <span>|</span>
                  <span className="text-white font-bold">${totalCartValue.toFixed(2)}</span>
                </div>
              </div>

              {/* Product Catalog Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeMvp.sampleProducts.map((prod) => (
                  <div key={prod.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-sky-400 uppercase">{prod.category}</span>
                      <h4 className="text-xs font-bold text-white mt-1 leading-snug">{prod.name}</h4>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-emerald-400 font-bold font-mono">${prod.price.toFixed(2)}</span>
                        <span className="text-slate-500 font-mono text-[11px]">{prod.stock} in stock</span>
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(prod)}
                      className="mt-4 w-full bg-slate-800 hover:bg-sky-600 text-white font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Cart & Sandbox Checkout Drawer */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                  Live Redis-Backed Cart & Payment Sandbox
                </h4>
                {cartItems.length === 0 ? (
                  <div className="text-xs text-slate-500 italic">Your cart is currently empty. Add items from above.</div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between text-xs text-slate-300 bg-slate-950 p-2 rounded-lg">
                          <span>{item.name} (x{item.qty})</span>
                          <span className="font-mono text-white">${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-800">
                      <div className="text-xs font-mono">
                        <span className="text-slate-400">Total Payable: </span>
                        <strong className="text-emerald-400 text-sm">${totalCartValue.toFixed(2)}</strong>
                      </div>

                      <button
                        onClick={simulateCheckout}
                        disabled={paymentSuccess}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Simulate Razorpay/Stripe Payment Webhook</span>
                      </button>
                    </div>

                    {paymentSuccess && (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Payment Signature Verified! Order created and 10-minute stock locks converted to confirmed shipment status.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FinCore Live Demo */}
          {selectedMvpId === 'fincore' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-sky-400" />
                    <span>FinCore Core Banking & Immutable Ledger</span>
                  </h3>
                  <p className="text-xs text-slate-400">Double-entry accounting, ACID serializable isolation, and SHA-256 audit chaining</p>
                </div>
              </div>

              {/* Accounts Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fincoreAccounts.map(acc => (
                  <div key={acc.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <div className="text-[11px] font-mono text-slate-400">{acc.accNo}</div>
                    <div className="text-xs font-bold text-white mt-1">{acc.name}</div>
                    <div className="text-2xl font-black text-emerald-400 font-mono mt-3">
                      ₹{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>

              {/* P2P Transfer Simulator */}
              <form onSubmit={executeTransfer} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Send className="w-4 h-4 text-sky-400" />
                  <span>Execute Simulated P2P Ledger Transfer</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Source Account</label>
                    <input disabled value="Alex Sharma (Savings)" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Destination Account</label>
                    <input disabled value="Campus Cafeteria Vendors" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Amount (₹)</label>
                    <input 
                      type="number" 
                      value={transferAmount} 
                      onChange={(e) => setTransferAmount(e.target.value)} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500 font-mono">Ensures no phantom money creation</span>
                  <button
                    type="submit"
                    className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-4 py-2 rounded-xl text-xs transition cursor-pointer shadow-md"
                  >
                    Transfer Funds & Write Journal
                  </button>
                </div>

                {transferNotice && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-300">
                    {transferNotice}
                  </div>
                )}
              </form>

              {/* Immutable Ledger Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                  Cryptographic Audit Ledger (Append-Only)
                </h4>
                <div className="space-y-2">
                  {transferLedger.map(tx => (
                    <div key={tx.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                      <div>
                        <div className="font-bold text-white">{tx.desc}</div>
                        <div className="text-[10px] font-mono text-slate-500">Hash: {tx.hash}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-rose-400">-₹{tx.debit.toFixed(2)}</div>
                        <div className="text-[10px] text-slate-500">{tx.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MediFlow Live Demo */}
          {selectedMvpId === 'mediflow' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-rose-400" />
                    <span>MediFlow Clinical Suite & OPD Queue</span>
                  </h3>
                  <p className="text-xs text-slate-400">Doctor schedules, time-slot optimistic locking, and synthetic electronic health records</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {activeMvp.sampleDoctors.map(doc => (
                  <div key={doc.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <div className="text-xs font-bold text-white">{doc.name}</div>
                    <div className="text-[11px] text-sky-400 font-mono mt-0.5">{doc.spec} · {doc.room}</div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono">Fee: ₹{doc.fee}</span>
                      <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">
                        Next: {doc.nextSlot}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Book New OPD Appointment</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={bookedPatient}
                    onChange={(e) => setBookedPatient(e.target.value)}
                    placeholder="Patient Name"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <button
                    onClick={bookAppointment}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-semibold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
                  >
                    Confirm Booking & Issue OPD Token
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Live OPD Waiting Room Tokens</h4>
                <div className="space-y-2">
                  {appointments.map(apt => (
                    <div key={apt.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 font-black flex items-center justify-center font-mono">
                          #{apt.token}
                        </span>
                        <div>
                          <div className="font-bold text-white">{apt.patient}</div>
                          <div className="text-[10px] text-slate-400">{apt.doctor}</div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {apt.status} ({apt.time})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CampusOS Live Demo */}
          {selectedMvpId === 'campusos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-400" />
                    <span>CampusOS Academic LMS & Automated Grader</span>
                  </h3>
                  <p className="text-xs text-slate-400">Course enrollment, attendance criteria (&gt;75%), and code grading pipelines</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {activeMvp.sampleCourses.map(course => (
                  <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <div className="text-[10px] font-mono text-emerald-400 font-bold">{course.code}</div>
                    <div className="text-xs font-bold text-white mt-1 leading-snug">{course.name}</div>
                    <div className="mt-3 space-y-1.5 text-[11px] font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>Attendance:</span>
                        <span className="text-emerald-400 font-bold">{course.attendance}%</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Progress:</span>
                        <span className="text-sky-400 font-bold">{course.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Active Assignments</h4>
                <div className="space-y-2.5">
                  {assignments.map(asg => (
                    <div key={asg.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="text-[10px] font-mono text-slate-500">{asg.course}</div>
                        <div className="font-bold text-white mt-0.5">{asg.title}</div>
                        <div className="text-[11px] font-mono text-emerald-400 mt-1">Status: {asg.grade}</div>
                      </div>
                      {!asg.submitted ? (
                        <button
                          onClick={() => submitAssignment(asg.id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl text-xs transition cursor-pointer self-start sm:self-auto"
                        >
                          Submit Solution for Auto-Grading
                        </button>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1 font-semibold text-xs">
                          <CheckCircle2 className="w-4 h-4" /> Evaluated
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Tab 2: Architecture Blueprint */}
      {activeSubTab === 'architecture' && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-sky-400" />
                <span>Enterprise Architecture: {activeMvp.architecture.pattern}</span>
              </h3>
              <p className="text-xs text-slate-400">High-concurrency microservice / modular monolith breakdown</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMvp.architecture.components.map((comp, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">{comp}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
            <div className="text-sky-400 font-bold mb-2">// ASCII System Request Flow</div>
            <pre className="text-[11px] leading-relaxed">
{`Client Browser (React 19)
    │  HTTPS (JWT Authorization Header)
    ▼
Reverse Proxy / API Gateway (Nginx / Spring Cloud Gateway)
    │  Rate Limiting & Correlation ID Injection
    ├───▶ Redis Cache (Session, Product Locks, Rate Limits)
    ▼
Core Business Application Service (${activeTrack === 'java' ? 'Spring Boot 3.3 REST' : 'FastAPI Async'})
    ├───▶ Relational Database (PostgreSQL 16 with B-Tree Indexes)
    └───▶ Async Message Broker (Kafka / Redis PubSub)
             │
             ▼
         Worker Consumer (Email, Webhook Dispatch, Invoice PDF)`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Database Schema */}
      {activeSubTab === 'schema' && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <span>Database Relational Schema (PostgreSQL DDL)</span>
            </h3>
            <p className="text-xs text-slate-400">Normalized 3NF relational models with foreign keys and strict constraints</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeMvp.databaseSchema.map((tbl, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="bg-slate-800/80 px-4 py-2 text-xs font-mono font-bold text-sky-400 flex items-center gap-2">
                  <Database className="w-3.5 h-3.5" />
                  <span>Table: {tbl.table}</span>
                </div>
                <div className="p-4 space-y-1.5 font-mono text-xs">
                  {tbl.columns.map((col, cidx) => (
                    <div key={cidx} className="text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                      <span>{col}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: REST API Documentation */}
      {activeSubTab === 'api' && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-purple-400" />
              <span>OpenAPI / Swagger REST Endpoints</span>
            </h3>
            <p className="text-xs text-slate-400">Standardized JSON request / response contracts</p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {activeMvp.apiEndpoints.map((ep, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ep.method === 'GET' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                    ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="text-white font-bold">{ep.path}</span>
                </div>
                <span className="text-slate-400 font-sans text-xs">{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
