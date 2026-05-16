const barbersData = {
    Riyadh: [
        { name: 'أخصائي وسام (خبير الباقات الملكية)', rating: '4.9 ★' },
        { name: 'أخصائي فهد (خبير تحديد ذقن وموس)', rating: '4.8 ★' }
    ],
    Jeddah: [
        { name: 'أخصائي كريم (ستايليست مودرن)', rating: '4.9 ★' },
        { name: 'أخصائي أحمد (خبير العناية والفيشل)', rating: '4.7 ★' }
    ]
};

let state = { branchCode: '', branch: '', service: '', price: 0, barber: '', date: '', time: '', payMethod: 'بواسطة مدى' };

function goToStep(num) {
    document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
    const currentSection = document.getElementById('step-' + num);
    if (currentSection) currentSection.classList.add('active');
    
    document.querySelectorAll('.step-node').forEach((node, idx) => {
        if (idx < num) node.classList.add('active');
        else node.classList.remove('active');
    });

    if (num === 5) {
        document.getElementById('sum-branch').innerText = state.branch;
        document.getElementById('sum-service').innerText = state.service;
        document.getElementById('sum-barber').innerText = state.barber;
        document.getElementById('sum-time').innerText = state.date + ' | ' + state.time;
        document.getElementById('sum-method').innerText = state.payMethod;
        document.getElementById('sum-price').innerText = state.price + ' ر.س';
    }
}

function selectBranch(code, name) { 
    state.branchCode = code; 
    state.branch = name; 
    renderBarbers(code);
    goToStep(2); 
}

function selectService(name, price) { 
    state.service = name; 
    state.price = price; 
    goToStep(3); 
}

function renderBarbers(branchCode) {
    const container = document.getElementById('barbers-container');
    container.innerHTML = '';
    const nextBtn = document.getElementById('next-to-4');
    if (nextBtn) nextBtn.disabled = true;

    barbersData[branchCode].forEach(barber => {
        const card = document.createElement('div');
        card.className = 'premium-card';
        card.onclick = function() {
            document.querySelectorAll('#barbers-container .premium-card').forEach(c => c.classList.remove('selected-card'));
            card.classList.add('selected-card');
            state.barber = barber.name;
            if (nextBtn) nextBtn.disabled = false;
        };
        card.innerHTML = `<div class="card-info-row"><div class="details-wrapper"><h3>${barber.name}</h3><p>تقييم العملاء: <span style="color:var(--gold-glow); font-weight:bold;">${barber.rating}</span></p></div></div>`;
        container.appendChild(card);
    });
}

function setupCalendar() {
    const input = document.getElementById('booking-date');
    if (input) {
        const today = new Date().toISOString().split('T');
        input.min = today;
        input.value = today;
        state.date = today;
        input.onchange = (e) => { state.date = e.target.value; };
    }
}

function handleBarberNext() { setupCalendar(); goToStep(4); }

function selectTime(element, timeStr) {
    document.querySelectorAll('.time-node').forEach(s => s.classList.remove('selected'));
    element.classList.add('selected');
    state.time = timeStr;
    const confirmBtn = document.getElementById('next-to-5');
    if (confirmBtn) confirmBtn.disabled = false;
}

function selectPaymentMethod(cardId, methodName) {
    document.querySelectorAll('.pay-card').forEach(c => c.classList.remove('selected-pay'));
    document.getElementById(cardId).classList.add('selected-pay');
    state.payMethod = methodName;
    const sumMethodLabel = document.getElementById('sum-method');
    if (sumMethodLabel) sumMethodLabel.innerText = methodName;
}

// دالة الحقن الفوري لقراءة المدخلات في نفس جزء الثانية ومنع التعليق
function forceSubmitForm() {
    const nameInput = document.getElementById('user-name');
    const phoneInput = document.getElementById('user-phone');
    
    if (!nameInput.value || !phoneInput.value) {
        alert('فضلاً، أدخل الاسم الكريم ورقم الجوال لإصدار التذكرة.');
        return;
    }

    let existingOrders = JSON.parse(localStorage.getItem('salon_orders')) || [];
    existingOrders.push({
        name: nameInput.value,
        phone: phoneInput.value, // القراءة الحتمية من مربع النص مباشرة
        branch: state.branch,
        service: state.service,
        barber: state.barber,
        price: state.price,
        date: state.date,
        time: state.time,
        method: state.payMethod
    });
    
    localStorage.setItem('salon_orders', JSON.stringify(existingOrders));
    document.getElementById('success-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('success-modal').classList.remove('active');
    goToStep(1);
    state = { branchCode: '', branch: '', service: '', price: 0, barber: '', date: '', time: '' , payMethod: 'بواسطة مدى'};
    document.querySelectorAll('.time-node').forEach(s => s.classList.remove('selected'));
    document.getElementById('next-to-4').disabled = true;
    document.getElementById('next-to-5').disabled = true;
    document.getElementById('booking-real-form').reset();
}
