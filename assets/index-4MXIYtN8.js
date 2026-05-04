(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))m(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&m(n)}).observe(document,{childList:!0,subtree:!0});function r(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function m(i){if(i.ep)return;i.ep=!0;const o=r(i);fetch(i.href,o)}})();const N="ahcms_token",O="ahcms_user";(function(){const a=localStorage.getItem("cw_hostel_token"),r=localStorage.getItem("cw_hostel_user");a&&(localStorage.setItem(N,a),localStorage.removeItem("cw_hostel_token")),r&&(localStorage.setItem(O,r),localStorage.removeItem("cw_hostel_user"))})();function Z(t,a){localStorage.setItem(N,t),localStorage.setItem(O,JSON.stringify(a))}function de(){return localStorage.getItem(N)}function J(){try{return JSON.parse(localStorage.getItem(O))}catch{return null}}function K(){var t;return((t=J())==null?void 0:t.role)||null}function ue(){const t=de();if(!t)return!1;try{return JSON.parse(atob(t.split(".")[1])).exp*1e3>Date.now()}catch{return!1}}function ce(){localStorage.removeItem(N),localStorage.removeItem(O)}const _={home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',complaints:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="15" r="0.5" fill="currentColor"/></svg>',booking:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',forum:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2v4l-4-4H9a2 2 0 0 1-2-2v-1"/><path d="M15 3H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2v4l4-4h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/></svg>',rooms:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',resources:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',logout:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',theme:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'},ge=[{id:"home",label:"Home",icon:_.home},{id:"complaints",label:"Complaint",icon:_.complaints},{id:"booking",label:"Room Booking",icon:_.booking},{id:"forum",label:"Community Forum",icon:_.forum},{id:"resources",label:"Resources",icon:_.resources}],ye=[{id:"home",label:"Home",icon:_.home},{id:"complaints",label:"Complaints",icon:_.complaints},{id:"rooms",label:"Room Details",icon:_.rooms},{id:"forum",label:"Community Forum",icon:_.forum},{id:"resources",label:"Resources",icon:_.resources}];function fe(t,a,r){var c,d;const m=K(),i=J(),o=m==="admin"?ye:ge,n=m==="admin"?"Admin Panel":"Student Portal";t.innerHTML=`
    <div class="sidebar-brand">
      <h1>AHCMS</h1>
      <span>${n}</span>
    </div>

    <div class="sidebar-user">
      <div class="sidebar-user-avatar">${((i==null?void 0:i.name)||"U")[0].toUpperCase()}</div>
      <div class="sidebar-user-info">
        <div class="sidebar-user-name">${(i==null?void 0:i.name)||"User"}</div>
        <div class="sidebar-user-role">${m==="admin"?"Administrator":(i==null?void 0:i.roll_no)||"Student"}</div>
      </div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-section-label">Navigation</div>
      ${o.map(e=>`
        <a class="nav-item${e.id===a?" active":""}"
           data-page="${e.id}"
           id="nav-${e.id}"
           role="button"
           tabindex="0">
          ${e.icon}
          ${e.label}
        </a>
      `).join("")}
    </div>

    <div class="sidebar-footer">
      <button class="nav-item logout-btn" id="nav-theme" style="margin-bottom: var(--space-2); color: var(--text-secondary);">
        ${_.theme}
        Toggle Theme
      </button>
      <button class="nav-item logout-btn" id="nav-logout">
        ${_.logout}
        Sign Out
      </button>
      <p>v2.0 · 2026</p>
    </div>
  `,t.querySelectorAll(".nav-item[data-page]").forEach(e=>{e.addEventListener("click",()=>r(e.dataset.page)),e.addEventListener("keydown",p=>{(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),e.click())})}),(c=document.getElementById("nav-logout"))==null||c.addEventListener("click",()=>{ce(),window.location.reload()}),(d=document.getElementById("nav-theme"))==null||d.addEventListener("click",()=>{const p=(document.documentElement.getAttribute("data-theme")||"light")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",p),localStorage.setItem("ahcms_theme",p)})}function be(){const t=document.createElement("button");t.className="sidebar-toggle",t.id="sidebar-toggle",t.innerHTML=_.menu,t.setAttribute("aria-label","Toggle navigation");const a=document.createElement("div");a.className="sidebar-overlay",a.id="sidebar-overlay",document.body.appendChild(t),document.body.appendChild(a);const r=document.getElementById("sidebar");function m(){r.classList.add("open"),a.classList.add("show"),t.innerHTML=_.close}function i(){r.classList.remove("open"),a.classList.remove("show"),t.innerHTML=_.menu}return t.addEventListener("click",()=>r.classList.contains("open")?i():m()),a.addEventListener("click",i),{close:i}}const he="/api";async function R(t,a,r){const m=de(),i={"Content-Type":"application/json"};m&&(i.Authorization=`Bearer ${m}`);const o=new AbortController,n=setTimeout(()=>o.abort(),1e4);try{const c=await fetch(`${he}${a}`,{method:t,headers:i,body:r!==void 0?JSON.stringify(r):void 0,signal:o.signal});if(c.status===401){ce(),window.location.reload();return}const d=await c.json().catch(()=>({}));if(!c.ok)throw new Error(d.error||`Request failed (${c.status})`);return d}catch(c){throw c.name==="AbortError"?new Error("Request timed out — is the server running?"):c}finally{clearTimeout(n)}}const $={get:t=>R("GET",t),post:(t,a)=>R("POST",t,a),patch:(t,a)=>R("PATCH",t,a),put:(t,a)=>R("PUT",t,a),delete:t=>R("DELETE",t)};let H=null;function xe(){H||(H=document.createElement("div"),H.className="toast-container",document.body.appendChild(H))}function B(t,a="info",r=3500){xe();const m=document.createElement("div");m.className=`toast toast-${a}`,m.textContent=t,H.appendChild(m),requestAnimationFrame(()=>{requestAnimationFrame(()=>{m.classList.add("show")})}),setTimeout(()=>{m.classList.remove("show"),setTimeout(()=>m.remove(),300)},r)}function $e(t){var m;document.body.innerHTML=`
    <div class="login-page">
      <div class="login-panel" style="position: relative;">

        <button id="login-theme" style="position: absolute; top: var(--space-6); right: var(--space-6); background: transparent; border: none; color: var(--text-tertiary); cursor: pointer; padding: var(--space-2); border-radius: var(--radius-md);" title="Toggle Theme" aria-label="Toggle Theme">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>

        <div class="login-brand">
          <div class="login-brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <h1>AHCMS</h1>
          <p>Amrita Hostel &amp; Complaint Management, Delhi NCR</p>
        </div>

        <div class="login-tabs">
          <button class="login-tab active" id="tab-student" data-tab="student">Student</button>
          <button class="login-tab" id="tab-admin" data-tab="admin">Admin</button>
        </div>

        <!-- Student Login -->
        <form id="form-student" class="login-form" novalidate>
          <div class="login-form-group">
            <label for="s-roll">Roll Number</label>
            <input type="text" id="s-roll" class="login-input" placeholder="e.g. DL.MBBS.U4AID24120" autocomplete="username" />
          </div>
          <div class="login-form-group">
            <label for="s-pass">Password</label>
            <input type="password" id="s-pass" class="login-input" placeholder="Enter your password" autocomplete="current-password" />
          </div>
          <p class="login-hint">Demo credentials &mdash; Roll: <code>DL.MBBS.U4AID24120</code> Pass: <code>Student@123</code></p>
          <button type="submit" class="login-btn" id="btn-student-login">Sign In</button>
          <div class="login-error" id="err-student"></div>
        </form>

        <!-- Admin Login -->
        <form id="form-admin" class="login-form hidden" novalidate>
          <div class="login-form-group">
            <label for="a-email">Email</label>
            <input type="email" id="a-email" class="login-input" placeholder="admin@ahcms.edu.in" autocomplete="username" />
          </div>
          <div class="login-form-group">
            <label for="a-pass">Password</label>
            <input type="password" id="a-pass" class="login-input" placeholder="Enter your password" autocomplete="current-password" />
          </div>
          <p class="login-hint">Demo credentials — Email: <code>admin@ahcms.edu.in</code> Pass: <code>Admin@123</code></p>
          <button type="submit" class="login-btn" id="btn-admin-login">Sign In</button>
          <div class="login-error" id="err-admin"></div>
          <div class="login-divider">or</div>
          <button type="button" class="login-btn login-btn-outline" id="btn-show-register">Create Admin Account</button>
        </form>

        <!-- Admin Register (hidden until clicked) -->
        <form id="form-register" class="login-form hidden" novalidate>
          <div class="login-form-group">
            <label for="r-name">Full Name</label>
            <input type="text" id="r-name" class="login-input" placeholder="Your full name" />
          </div>
          <div class="login-form-group">
            <label for="r-email">Email</label>
            <input type="email" id="r-email" class="login-input" placeholder="you@ahcms.edu.in" />
          </div>
          <div class="login-form-group">
            <label for="r-pass">Password</label>
            <input type="password" id="r-pass" class="login-input" placeholder="Min. 8 characters (e.g. Admin@123)" />
          </div>
          <button type="submit" class="login-btn" id="btn-register">Create Account</button>
          <div class="login-error" id="err-register"></div>
          <button type="button" class="login-btn login-btn-ghost" id="btn-back-login">← Back to Login</button>
        </form>

      </div>

      <div class="login-art">
        <div class="login-art-content">
          <h2>Your hostel,<br>fully managed.</h2>
          <p>Room allocations, complaints, community — all in one place.</p>
          <div class="login-art-dots">
            <span class="dot dot-blue"></span>
            <span class="dot dot-green"></span>
            <span class="dot dot-purple"></span>
          </div>
        </div>
      </div>
    </div>
  `,(m=document.getElementById("login-theme"))==null||m.addEventListener("click",()=>{const o=(document.documentElement.getAttribute("data-theme")||"light")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",o),localStorage.setItem("ahcms_theme",o)});let a="student";document.querySelectorAll(".login-tab").forEach(i=>{i.addEventListener("click",()=>{a=i.dataset.tab,document.querySelectorAll(".login-tab").forEach(o=>o.classList.remove("active")),i.classList.add("active"),document.getElementById("form-student").classList.toggle("hidden",a!=="student"),document.getElementById("form-admin").classList.toggle("hidden",a!=="admin"),document.getElementById("form-register").classList.add("hidden")})}),document.getElementById("btn-show-register").addEventListener("click",()=>{document.getElementById("form-admin").classList.add("hidden"),document.getElementById("form-register").classList.remove("hidden")}),document.getElementById("btn-back-login").addEventListener("click",()=>{document.getElementById("form-register").classList.add("hidden"),document.getElementById("form-admin").classList.remove("hidden")});function r(i,o){const n=document.getElementById(i);n.disabled=o,n.textContent=o?"Signing in…":"Sign In"}document.getElementById("form-student").addEventListener("submit",async i=>{i.preventDefault();const o=document.getElementById("s-roll").value.trim(),n=document.getElementById("s-pass").value,c=document.getElementById("err-student");if(c.textContent="",!o||!n){c.textContent="All fields required.";return}r("btn-student-login",!0);try{const{token:d,user:e}=await $.post("/auth/student/login",{roll_no:o,password:n});Z(d,e),t()}catch(d){c.textContent=d.message}finally{r("btn-student-login",!1)}}),document.getElementById("form-admin").addEventListener("submit",async i=>{i.preventDefault();const o=document.getElementById("a-email").value.trim(),n=document.getElementById("a-pass").value,c=document.getElementById("err-admin");if(c.textContent="",!o||!n){c.textContent="All fields required.";return}r("btn-admin-login",!0);try{const{token:d,user:e}=await $.post("/auth/admin/login",{email:o,password:n});Z(d,e),t()}catch(d){c.textContent=d.message}finally{r("btn-admin-login",!1)}}),document.getElementById("form-register").addEventListener("submit",async i=>{i.preventDefault();const o=document.getElementById("r-name").value.trim(),n=document.getElementById("r-email").value.trim(),c=document.getElementById("r-pass").value,d=document.getElementById("err-register");if(d.textContent="",!o||!n||!c){d.textContent="All fields required.";return}if(c.length<8){d.textContent="Password must be at least 8 characters.";return}const e=document.getElementById("btn-register");e.disabled=!0,e.textContent="Creating…";try{await $.post("/auth/admin/register",{name:o,email:n,password:c}),B("Account created! Please sign in.","success"),document.getElementById("btn-back-login").click(),document.getElementById("a-email").value=n}catch(p){d.textContent=p.message}finally{e.disabled=!1,e.textContent="Create Account"}})}async function we(t){t.innerHTML='<div class="page-loading">Loading…</div>';try{const{student:a,allocation:r,complaints:m,wardens:i,wardenOfficePhone:o}=await $.get("/dashboard/student");Ee(t,a,r,m,i,o)}catch(a){t.innerHTML=`<div class="page-error">Failed to load dashboard: ${a.message}</div>`}}function Ee(t,a,r,m,i,o){var d;const n=i.filter(e=>e.role==="Warden"),c=i.filter(e=>e.role==="Guard");t.innerHTML=`
    <div class="page-enter" id="student-home">
      <div class="page-header">
        <h2>Welcome, ${((d=a==null?void 0:a.name)==null?void 0:d.split(" ")[0])||"Student"}</h2>
        <p>${(a==null?void 0:a.course)||""} · ${(a==null?void 0:a.hostel)||""} · Year ${(a==null?void 0:a.year)||""}</p>
      </div>

      <!-- Student Info Card -->
      <div class="form-section" style="max-width: none; margin-bottom: var(--space-10);">
        <div class="form-section-title">Your Profile</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--space-4);">
          ${[["Roll No",a==null?void 0:a.roll_no],["Course",a==null?void 0:a.course],["Admission",a==null?void 0:a.adm_year],["Passing Year",a==null?void 0:a.pass_year],["Gender",(a==null?void 0:a.gender)==="M"?"Male":(a==null?void 0:a.gender)==="F"?"Female":a==null?void 0:a.gender],["Address",(a==null?void 0:a.address)||"—"]].map(([e,p])=>`
            <div>
              <div style="font-size: var(--text-xs); color: var(--text-tertiary); text-transform: uppercase; letter-spacing: .06em;">${e}</div>
              <div style="font-size: var(--text-sm); color: var(--text-primary); margin-top: 4px;">${p||"—"}</div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Room Card -->
      <div class="card-grid">
        <div class="card card-accent-blue" style="grid-column: span 2;">
          <div class="card-label">Your Room</div>
          ${r?`<div class="card-value">${r.room_id}</div>
               <div class="card-sub">${r.hostel} · Floor ${r.floor} · ${r.type} · ${r.status}</div>
               <div style="margin-top: var(--space-2); font-size: var(--text-xs); color: var(--text-tertiary);">
                 ${r.from_date} → ${r.to_date}
               </div>`:`<div style="color: var(--text-tertiary); font-size: var(--text-sm); padding: var(--space-2) 0;">
                 No active room allocation. <a class="link-accent" href="#booking">Book a room →</a>
               </div>`}
        </div>

        <div class="card card-accent-amber">
          <div class="card-label">Open Complaints</div>
          <div class="card-value">${m.filter(e=>e.status==="open").length}</div>
          <div class="card-sub">${m.filter(e=>e.status==="in-progress").length} in progress</div>
        </div>

        <div class="card card-accent-green">
          <div class="card-label">Resolved</div>
          <div class="card-value">${m.filter(e=>e.status==="resolved").length}</div>
          <div class="card-sub">of ${m.length} total</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6);">
        <!-- On-Duty Wardens -->
        <div class="form-section" style="max-width: none;">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:var(--space-2); margin-bottom:var(--space-4);">
            <div class="form-section-title" style="margin-bottom:0;">On-Duty Wardens</div>
            ${o?`
              <a href="tel:${o}" style="
                display: inline-flex; align-items: center; gap: 6px;
                background: color-mix(in srgb, var(--accent-green) 12%, transparent);
                border: 1px solid color-mix(in srgb, var(--accent-green) 30%, transparent);
                color: var(--accent-green);
                font-size: var(--text-xs);
                font-weight: 600;
                letter-spacing: .04em;
                padding: 4px 10px;
                border-radius: 999px;
                text-decoration: none;
                transition: background .15s, transform .1s;
              "
              onmouseover="this.style.background='color-mix(in srgb,var(--accent-green) 22%,transparent)'; this.style.transform='scale(1.03)'"
              onmouseout="this.style.background='color-mix(in srgb,var(--accent-green) 12%,transparent)'; this.style.transform='scale(1)'"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Office: ${o}
              </a>`:""}
          </div>
          ${n.length===0?'<p class="empty-msg">No warden data available.</p>':n.map(e=>`
              <div class="contact-row" style="align-items: flex-start;">
                <div class="contact-avatar">${e.name[0]}</div>
                <div class="contact-info" style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2px;">
                    <div class="contact-name">${e.name}</div>
                    <a href="tel:${e.phone}" class="contact-phone" style="margin-left: auto;">${e.phone||"—"}</a>
                  </div>
                  <div class="contact-meta">${e.hostel}</div>
                  <div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 11px; margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border-color); color: var(--text-secondary);">
                    <span><span style="font-weight:600; color:var(--text-tertiary);">Last:</span> ${e.previous?e.previous.name:"Unknown"}</span>
                    <span style="color:var(--accent-green);"><span style="font-weight:600;">Current:</span> Active</span>
                    <span><span style="font-weight:600; color:var(--text-tertiary);">Next:</span> ${e.next?e.next.name:"Unknown"}</span>
                  </div>
                </div>
              </div>
            `).join("")}

          <div class="form-section-title" style="margin-top: var(--space-6);">On-Duty Guards</div>
          ${c.length===0?'<p class="empty-msg">No guard data.</p>':c.map(e=>`
              <div class="contact-row">
                <div class="contact-avatar guard">${e.name[0]}</div>
                <div class="contact-info">
                  <div class="contact-name">${e.name}</div>
                  <div class="contact-meta">${e.hostel} · ${e.shift} shift</div>
                </div>
                <a href="tel:${e.phone}" class="contact-phone">${e.phone||"—"}</a>
              </div>
            `).join("")}
        </div>

        <!-- Recent Complaints -->
        <div class="form-section" style="max-width: none;">
          <div class="form-section-title">Your Recent Complaints</div>
          ${m.length===0?'<p class="empty-msg">No complaints filed yet.</p>':`<div class="activity-list">
                ${m.slice(0,5).map(e=>`
                    <div class="activity-item">
                      <div class="activity-dot" style="background:${e.status==="open"?"var(--accent-amber)":e.status==="in-progress"?"var(--accent-blue)":"var(--accent-green)"}"></div>
                      <div class="activity-content">
                        <div class="activity-text">${e.category} — <span class="badge badge-${e.status}">${e.status}</span></div>
                        <div class="activity-time">${e.date} · ${e.room_id||"N/A"}</div>
                        <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px;">${e.description.slice(0,60)}…</div>
                      </div>
                    </div>
                  `).join("")}
              </div>`}
          <a class="link-accent" href="#complaints" style="display:block; margin-top: var(--space-4); font-size: var(--text-sm);">View all complaints →</a>
        </div>
      </div>


    </div>
  `,t.querySelectorAll('a.link-accent[href^="#"]').forEach(e=>{e.addEventListener("click",p=>{p.preventDefault(),window.location.hash=e.getAttribute("href").slice(1)})}),requestAnimationFrame(()=>{var e;return(e=document.getElementById("student-home"))==null?void 0:e.classList.replace("page-enter","page-active")})}const ee=["Plumbing","Electricity","WiFi","Cleanliness","Carpentry","Other"],T=t=>`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;opacity:.6;vertical-align:middle;">${t}</svg>`,ke={Plumbing:T('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),Electricity:T('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'),WiFi:T('<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>'),Cleanliness:T('<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'),Carpentry:T('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),Other:T('<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>')},Be=["open","in-progress","resolved"];async function Ce(t){t.innerHTML='<div class="page-loading">Loading…</div>';let a=[];try{a=await $.get("/complaints")}catch(r){t.innerHTML=`<div class="page-error">Failed to load: ${r.message}</div>`;return}Se(t,a)}function Se(t,a){let r=a,m="all",i="";t.innerHTML=`
    <div class="page-enter" id="complaints-page">
      <div class="page-header">
        <h2>Complaints</h2>
        <p>Lodge a complaint by category or track your existing ones.</p>
      </div>

      <!-- Lodge Form -->
      <div class="form-section" style="margin-bottom: var(--space-6); max-width: none;">
        <div class="form-section-title">Lodge a Complaint</div>
        <form id="complaint-form" novalidate>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label" for="cmp-category">Category <span style="color:var(--danger)">*</span></label>
              <select class="form-select" id="cmp-category" required>
                <option value="">Select category…</option>
                ${ee.map(e=>`<option value="${e}">${e}</option>`).join("")}
              </select>
              <div class="form-error" id="err-cmp-cat">Category is required</div>
            </div>
            <div class="form-group" id="cmp-other-group" style="display: none;">
              <label class="form-label" for="cmp-other-type">Please Specify Category <span style="color:var(--danger)">*</span></label>
              <input type="text" class="form-input" id="cmp-other-type" placeholder="e.g. Pest Control, Room Allocation..." />
              <div class="form-error" id="err-cmp-other">Please specify what the complaint is about.</div>
            </div>
            <div class="form-group">
              <label class="form-label" for="cmp-photo">Attach Photo <span style="color:var(--text-tertiary)">(optional)</span></label>
              <input type="file" class="form-input" id="cmp-photo" accept="image/*" />
            </div>
            <div class="form-group full-width">
              <label class="form-label" for="cmp-desc">Description <span style="color:var(--danger)">*</span></label>
              <textarea class="form-textarea" id="cmp-desc" rows="3" placeholder="Describe the issue in detail…" required></textarea>
              <div class="form-error" id="err-cmp-desc">Description is required</div>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" id="cmp-submit">Submit Complaint</button>
            <button type="reset" class="btn btn-secondary">Clear</button>
          </div>
        </form>
      </div>

      <!-- Category Filter -->
      <div class="cat-filter-row">
        <label class="form-label" for="cat-filter-select">Filter by Category</label>
        <select class="form-select cat-filter-select" id="cat-filter-select">
          <option value="">All Categories</option>
          ${ee.map(e=>`<option value="${e}">${e}</option>`).join("")}
        </select>
      </div>

      <!-- My Complaints Table -->
      <div class="table-container">
        <div class="table-toolbar">
          <div class="table-toolbar-title">My Complaints</div>
          <div style="display:flex; gap: var(--space-2); flex-wrap: wrap;">
            <button class="filter-chip active" data-status="all">All</button>
            ${Be.map(e=>`<button class="filter-chip" data-status="${e}">${e}</button>`).join("")}
          </div>
        </div>
        <div id="complaints-list"></div>
      </div>
    </div>
  `;function o(){let e=r;i&&(e=e.filter(s=>s.category===i)),m!=="all"&&(e=e.filter(s=>s.status===m));const p=document.getElementById("complaints-list");if(e.length===0){p.innerHTML='<p style="padding: var(--space-8); text-align:center; color: var(--text-tertiary);">No complaints found.</p>';return}p.innerHTML=`
      <table>
        <thead>
          <tr>
            <th>#</th><th>Category</th><th>Description</th><th>Date</th><th>Status</th><th>Note</th>
          </tr>
        </thead>
        <tbody>
          ${e.map(s=>`
            <tr>
              <td class="cell-mono">${s.complaint_id}</td>
              <td><span style="display:inline-flex;align-items:center;gap:5px;">${ke[s.category]||""} ${s.category}</span></td>
              <td style="max-width:220px; overflow:hidden; text-overflow:ellipsis;" title="${s.description}">${s.description.slice(0,50)}${s.description.length>50?"…":""}</td>
              <td class="cell-mono">${s.date}</td>
              <td><span class="badge badge-${s.status}">${s.status}</span></td>
              <td style="color: var(--text-tertiary); font-size: var(--text-xs);">${s.admin_note||"—"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `}document.getElementById("cat-filter-select").addEventListener("change",e=>{i=e.target.value,o()}),t.querySelectorAll("[data-status]").forEach(e=>{e.addEventListener("click",()=>{t.querySelectorAll("[data-status]").forEach(p=>p.classList.remove("active")),e.classList.add("active"),m=e.dataset.status,o()})});const n=document.getElementById("cmp-category"),c=document.getElementById("cmp-other-group");n.addEventListener("change",e=>{e.target.value==="Other"?c.style.display="":(c.style.display="none",document.getElementById("cmp-other-type").value="",document.getElementById("err-cmp-other").classList.remove("visible"))});const d=document.getElementById("complaint-form");d.addEventListener("submit",async e=>{e.preventDefault();let p=!0;t.querySelectorAll(".form-error").forEach(x=>x.classList.remove("visible"));const s=document.getElementById("cmp-category").value,b=document.getElementById("cmp-other-type").value.trim(),k=document.getElementById("cmp-desc").value.trim(),u=document.getElementById("cmp-photo").files[0];if(s||(document.getElementById("err-cmp-cat").classList.add("visible"),p=!1),s==="Other"&&!b&&(document.getElementById("err-cmp-other").classList.add("visible"),p=!1),k||(document.getElementById("err-cmp-desc").classList.add("visible"),p=!1),!p){B("Fill in all required fields.","error");return}const y=document.getElementById("cmp-submit");y.disabled=!0,y.textContent="Submitting…";try{let x=null;u&&(x=await new Promise((l,w)=>{const v=new FileReader;v.onload=()=>l(v.result),v.onerror=w,v.readAsDataURL(u)}));const f=s==="Other"&&b?`[Other: ${b}] ${k}`:k,C=await $.post("/complaints",{category:s,description:f,photo_base64:x});r=[C,...r],B(`Complaint #${C.complaint_id} submitted.`,"success"),d.reset(),o()}catch(x){B(x.message,"error")}finally{y.disabled=!1,y.textContent="Submit Complaint"}}),d.addEventListener("reset",()=>{t.querySelectorAll(".form-error").forEach(e=>e.classList.remove("visible")),document.getElementById("cmp-other-group").style.display="none"}),o(),requestAnimationFrame(()=>{var e;return(e=document.getElementById("complaints-page"))==null?void 0:e.classList.replace("page-enter","page-active")})}async function G(t){t.innerHTML='<div class="page-loading">Loading rooms…</div>';try{const[a,{allocation:r},m,i]=await Promise.all([$.get("/rooms"),$.get("/rooms/my-allocation"),$.get("/rooms/booking-requests"),$.get("/rooms/change-requests")]);Le(t,a,r,m,i)}catch(a){t.innerHTML=`<div class="page-error">Failed to load: ${a.message}</div>`}}function Le(t,a,r,m,i){var u,y,x,f,C,l,w;const o=J(),n=a.filter(v=>v.hostel===((o==null?void 0:o.hostel)||"")),c=[...new Set(n.map(v=>v.floor))].sort((v,g)=>v-g);let d=c[0]||1,e=null;const p=m.find(v=>v.status==="pending"),s=i.find(v=>v.status==="pending");if(t.innerHTML=`
    <style>
      .alloc-card {
        background: var(--bg-elevated);
        border: 1px solid color-mix(in srgb, var(--accent-green) 30%, transparent);
        border-radius: var(--radius-lg);
        padding: var(--space-6);
        margin-bottom: var(--space-6);
      }
      .alloc-room-num {
        font-size: 48px; font-weight: 800; color: var(--accent-green);
        letter-spacing: -2px; line-height: 1;
      }
      .alloc-meta { font-size: var(--text-sm); color: var(--text-secondary); margin-top: 4px; }
      .change-req-form { margin-top: var(--space-8); padding-top: var(--space-8); border-top: 1px solid var(--border-subtle); }
    </style>

    <div class="page-enter" id="booking-page">
      <div class="page-header">
        <h2>My Room</h2>
        <p>View your room assignment, request a room change, or apply for initial allocation.</p>
      </div>

      <!-- ① Allocated: room card + change request -->
      ${r?`
        <div class="alloc-card">
          <div style="display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:var(--space-4);">
            <div>
              <div style="font-size:var(--text-xs); font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--text-tertiary); margin-bottom:var(--space-2);">Your Room</div>
              <div class="alloc-room-num">${r.room_id}</div>
              <div class="alloc-meta">${r.hostel}</div>
              <div class="alloc-meta">Floor ${r.floor} · ${r.type} · ${r.current_occupancy}/${r.capacity} occupied</div>
              <div class="alloc-meta" style="margin-top:var(--space-2);">Since ${r.from_date} · Until ${r.to_date}</div>
            </div>
            <div style="display:flex; flex-direction:column; gap:var(--space-2); align-items:flex-end;">
              <span class="badge badge-in-progress" style="font-size:13px; padding:6px 14px;">Active</span>
              ${s?'<div style="font-size:var(--text-xs); color:var(--accent-amber); margin-top:var(--space-2);">Room change pending review</div>':'<button class="btn btn-secondary" id="btn-show-change" style="margin-top:var(--space-2);">Request Room Change</button>'}
            </div>
          </div>

          <!-- Room change request form (hidden until button click) -->
                <div id="change-req-section" class="change-req-form" style="display:${s?"block":"none"}">
            ${s?`
              <div style="font-size:var(--text-sm); font-weight:600; color:var(--accent-amber); margin-bottom:var(--space-3);">Pending Room Change Request</div>
              <div style="font-size:var(--text-sm); color:var(--text-secondary);">
                You have requested to move to <strong>${s.to_room_id}</strong> (${s.to_hostel}, Floor ${s.to_floor}).
                Submitted on ${(u=s.created_at)==null?void 0:u.slice(0,10)}. Awaiting warden approval.
              </div>
            `:(()=>{const v=a.filter(h=>h.hostel===r.hostel&&h.floor===r.floor&&h.room_id!==r.room_id&&h.current_occupancy<h.capacity).sort((h,L)=>h.room_id.localeCompare(L.room_id)),g=v.length===0,E=g?a.filter(h=>h.hostel===r.hostel&&h.room_id!==r.room_id&&h.current_occupancy<h.capacity).sort((h,L)=>h.floor-L.floor||h.room_id.localeCompare(L.room_id)):v;return`
              <div style="font-size:var(--text-sm); font-weight:600; margin-bottom:var(--space-4);">Request a Room Change</div>
              ${g?`
                <div style="font-size:var(--text-xs); background:color-mix(in srgb,var(--accent-amber) 10%,transparent); border:1px solid color-mix(in srgb,var(--accent-amber) 25%,transparent); border-radius:8px; padding:var(--space-3) var(--space-4); color:var(--accent-amber); margin-bottom:var(--space-4);">
                  All rooms on your floor (Floor ${r.floor}) are currently full. You may request a transfer to another floor.
                </div>
              `:`
                <div style="font-size:var(--text-xs); color:var(--text-tertiary); margin-bottom:var(--space-4);">
                  Only rooms on your current floor (Floor ${r.floor}) are shown. Cross-floor transfers are only allowed when your floor has no available rooms.
                </div>
              `}
              <div id="change-msg"></div>
              <form id="change-req-form">
                <div class="form-group">
                  <label class="form-label">Target Room *</label>
                  <select class="form-select" id="change-target-room" name="to_room_id" required>
                    <option value="">— select a room —</option>
                    ${E.map(h=>`<option value="${h.room_id}">${h.room_id} · Fl ${h.floor} · ${h.type} · ${h.current_occupancy}/${h.capacity}</option>`).join("")}
                  </select>
                  ${E.length===0?'<div style="font-size:var(--text-xs); color:var(--accent-red); margin-top:4px;">No available rooms in your hostel.</div>':""}
                </div>
                <div class="form-group">
                  <label class="form-label">Reason for Change *</label>
                  <textarea class="form-textarea" name="reason" rows="3" placeholder="Explain why you need a different room…" required></textarea>
                </div>
                <div class="form-actions">
                  <button type="submit" class="btn btn-primary" id="btn-submit-change">Submit Request</button>
                  <button type="button" class="btn btn-secondary" id="btn-cancel-change">Cancel</button>
                </div>
              </form>`})()}
          </div>
        </div>
      `:p?`
        <!-- ② No allocation but pending booking -->
        <div style="background:var(--bg-elevated); border:1px solid color-mix(in srgb,var(--accent-amber) 30%,transparent); border-radius:var(--radius-lg); padding:var(--space-6); margin-bottom:var(--space-6);">
          <div style="font-size:var(--text-xs); font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--text-tertiary); margin-bottom:var(--space-2);">Pending Booking Request</div>
          <div style="font-size:var(--text-2xl); font-weight:700; color:var(--accent-amber);">${p.room_id}</div>
          <div style="font-size:var(--text-sm); color:var(--text-secondary); margin-top:4px;">Submitted ${(y=p.created_at)==null?void 0:y.slice(0,10)} · Waiting for warden approval</div>
        </div>
      `:""}

      <!-- ③ Floor Plan (only shown if not yet allocated) -->
      ${r?"":`
        <div style="display:flex; align-items:center; gap:var(--space-4); margin-bottom:var(--space-5);">
          <span style="font-size:var(--text-sm); color:var(--text-secondary); font-weight:500;">Floor:</span>
          <div class="cat-tabs" style="margin:0;">
            ${c.map(v=>`
              <button class="cat-tab${v===d?" active":""}" data-floor="${v}">Floor ${v}</button>
            `).join("")}
          </div>
        </div>

        <div class="form-section" style="max-width:none; margin-bottom:var(--space-6);" id="floor-plan-section">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-4);">
            <div class="form-section-title" id="floor-plan-title" style="margin-bottom:0;">Floor ${d} — ${(o==null?void 0:o.hostel)||""}</div>
            <div style="display:flex; gap:var(--space-4);">
              <span style="display:flex; align-items:center; gap:6px; font-size:var(--text-xs); color:var(--text-tertiary);"><span style="width:10px;height:10px;border-radius:50%;background:var(--accent-green); display:inline-block;"></span>Vacant</span>
              <span style="display:flex; align-items:center; gap:6px; font-size:var(--text-xs); color:var(--text-tertiary);"><span style="width:10px;height:10px;border-radius:50%;background:var(--accent-amber); display:inline-block;"></span>Partial</span>
              <span style="display:flex; align-items:center; gap:6px; font-size:var(--text-xs); color:var(--text-tertiary);"><span style="width:10px;height:10px;border-radius:50%;background:var(--accent-red); display:inline-block;"></span>Full</span>
            </div>
          </div>
          <div class="floor-plan" id="floor-plan"></div>
        </div>

        <div id="room-detail-panel" class="form-section" style="max-width:none; display:none; margin-bottom:var(--space-6);">
          <div class="form-section-title" id="room-detail-title">Room Details</div>
          <div id="room-detail-body"></div>
          <form id="booking-form" style="margin-top:var(--space-5);" novalidate>
            <div class="form-group" style="max-width:480px;">
              <label class="form-label" for="booking-pref">Preferences <span style="color:var(--text-tertiary)">(optional)</span></label>
              <textarea class="form-textarea" id="booking-pref" rows="2" placeholder="e.g. prefer window side, near bathroom…"></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary" id="btn-book">Request This Room</button>
              <button type="button" class="btn btn-secondary" id="btn-cancel-room">Cancel</button>
            </div>
          </form>
        </div>
      `}

      <!-- History -->
      <div class="table-container" style="margin-bottom:var(--space-6);">
        <div class="table-toolbar"><div class="table-toolbar-title">My Booking Requests</div></div>
        ${m.length===0?'<p style="padding:var(--space-6); text-align:center; color:var(--text-tertiary);">No booking requests yet.</p>':`<table>
              <thead><tr><th>Room</th><th>Hostel</th><th>Floor</th><th>Type</th><th>Status</th><th>Note</th><th>Date</th></tr></thead>
              <tbody>
                ${m.map(v=>{var g;return`
                    <tr>
                      <td class="cell-mono">${v.room_id}</td>
                      <td style="font-size:var(--text-xs);">${v.hostel}</td>
                      <td>${v.floor}</td>
                      <td>${v.type}</td>
                      <td><span class="badge badge-${v.status==="pending"?"open":v.status==="approved"?"in-progress":"resolved"}">${v.status}</span></td>
                      <td style="color:var(--text-tertiary); font-size:var(--text-xs);">${v.admin_note||"—"}</td>
                      <td class="cell-mono">${(g=v.created_at)==null?void 0:g.slice(0,10)}</td>
                    </tr>
                `}).join("")}
              </tbody>
            </table>`}
      </div>

      ${i.length>0?`
      <div class="table-container">
        <div class="table-toolbar"><div class="table-toolbar-title">My Room Change Requests</div></div>
        <table>
          <thead><tr><th>From</th><th>To</th><th>To Hostel</th><th>Reason</th><th>Status</th><th>Note</th><th>Date</th></tr></thead>
          <tbody>
            ${i.map(v=>{var g;return`
              <tr>
                <td class="cell-mono">${v.from_room_id}</td>
                <td class="cell-mono">${v.to_room_id}</td>
                <td style="font-size:var(--text-xs);">${v.to_hostel}</td>
                <td style="max-width:160px; font-size:var(--text-xs);" title="${v.reason}">${v.reason.slice(0,50)}${v.reason.length>50?"…":""}</td>
                <td><span class="badge badge-${v.status==="pending"?"open":v.status==="approved"?"in-progress":"resolved"}">${v.status}</span></td>
                <td style="color:var(--text-tertiary); font-size:var(--text-xs);">${v.admin_note||"—"}</td>
                <td class="cell-mono">${(g=v.created_at)==null?void 0:g.slice(0,10)}</td>
              </tr>
            `}).join("")}
          </tbody>
        </table>
      </div>
      `:""}
    </div>
  `,!r){let v=function(E){const h=n.filter(S=>S.floor===E);document.getElementById("floor-plan-title").textContent=`Floor ${E} — ${(o==null?void 0:o.hostel)||""}`;const L=document.getElementById("floor-plan");if(!h.length){L.innerHTML='<p style="color:var(--text-tertiary); padding:var(--space-4);">No rooms on this floor.</p>';return}L.innerHTML=h.sort((S,M)=>S.room_id.localeCompare(M.room_id)).map(S=>{const M=S.capacity>0?S.current_occupancy/S.capacity:0,F=M===0?"vacant":M<1?"partial":"full",ve=(e==null?void 0:e.room_id)===S.room_id;return`
            <button class="room-cell ${F}${ve?" selected":""}"
                    data-room="${S.room_id}"
                    ${F==="full"?"disabled":""}
                    title="${S.room_id} · ${S.type} · ${S.current_occupancy}/${S.capacity}">
              <span class="room-cell-id">${S.room_id}</span>
              <span class="room-cell-type">${S.type[0]}</span>
              <span class="room-cell-occ">${S.current_occupancy}/${S.capacity}</span>
            </button>`}).join(""),L.querySelectorAll(".room-cell:not([disabled])").forEach(S=>{S.addEventListener("click",()=>{e=n.find(M=>M.room_id===S.dataset.room),v(E),g(e)})})},g=function(E){const h=document.getElementById("room-detail-panel");document.getElementById("room-detail-title").textContent=`Room ${E.room_id}`,document.getElementById("room-detail-body").innerHTML=`
        <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(130px,1fr)); gap:var(--space-4);">
          ${[["Hostel",E.hostel],["Floor",E.floor],["Type",E.type],["Capacity",`${E.capacity} beds`],["Occupied",`${E.current_occupancy}/${E.capacity}`],["Available",`${E.available_slots} slot(s)`]].map(([L,S])=>`<div>
              <div style="font-size:var(--text-xs); color:var(--text-tertiary); text-transform:uppercase; letter-spacing:.06em;">${L}</div>
              <div style="font-size:var(--text-sm); margin-top:4px;">${S}</div>
            </div>`).join("")}
        </div>
      `,h.style.display=p?"none":"block"};var b=v,k=g;t.querySelectorAll(".cat-tab[data-floor]").forEach(E=>{E.addEventListener("click",()=>{t.querySelectorAll(".cat-tab[data-floor]").forEach(h=>h.classList.remove("active")),E.classList.add("active"),d=+E.dataset.floor,e=null,document.getElementById("room-detail-panel").style.display="none",v(d)})}),(x=document.getElementById("btn-cancel-room"))==null||x.addEventListener("click",()=>{e=null,document.getElementById("room-detail-panel").style.display="none",v(d)}),(f=document.getElementById("booking-form"))==null||f.addEventListener("submit",async E=>{if(E.preventDefault(),!e)return;const h=document.getElementById("btn-book");h.disabled=!0,h.textContent="Submitting…";try{await $.post("/rooms/book",{room_id:e.room_id,preferences:document.getElementById("booking-pref").value.trim()}),B(`Booking request for ${e.room_id} submitted!`,"success"),G(t)}catch(L){B(L.message,"error"),h.disabled=!1,h.textContent="Request This Room"}}),v(d)}r&&!s&&((C=document.getElementById("btn-show-change"))==null||C.addEventListener("click",()=>{document.getElementById("change-req-section").style.display="block",document.getElementById("btn-show-change").style.display="none"}),(l=document.getElementById("btn-cancel-change"))==null||l.addEventListener("click",()=>{document.getElementById("change-req-section").style.display="none",document.getElementById("btn-show-change").style.display=""}),(w=document.getElementById("change-req-form"))==null||w.addEventListener("submit",async v=>{v.preventDefault();const g=new FormData(v.target),E=document.getElementById("btn-submit-change"),h=document.getElementById("change-msg");E.disabled=!0,E.textContent="Submitting…",h.innerHTML="";try{await $.post("/rooms/change-requests",Object.fromEntries(g.entries())),B("Room change request submitted. Awaiting warden approval.","success"),G(t)}catch(L){h.innerHTML=`<div style="color:var(--accent-red); font-size:var(--text-sm); margin-bottom:var(--space-3); padding:var(--space-3); background:color-mix(in srgb,var(--accent-red) 10%,transparent); border-radius:8px;">${L.message}</div>`,E.disabled=!1,E.textContent="Submit Request"}})),requestAnimationFrame(()=>{var v;return(v=document.getElementById("booking-page"))==null?void 0:v.classList.replace("page-enter","page-active")})}async function pe(t){t.innerHTML='<div class="page-loading">Loading forum…</div>';try{const a=await $.get("/forum");_e(t,a)}catch(a){t.innerHTML=`<div class="page-error">Failed to load forum: ${a.message}</div>`}}function _e(t,a){const r=K()==="admin";let m=a;t.innerHTML=`
    <div class="page-enter" id="forum-page">
      <div class="page-header">
        <h2>Community Forum</h2>
        <p>${r?"Read all campus posts — posting is disabled for admins.":"Share thoughts anonymously with your campus community."}</p>
      </div>

      ${r?`
        <div class="alert-banner alert-blue" style="margin-bottom: var(--space-6);">
          Viewing as Admin — posts are read-only. Student identities are never stored.
        </div>
      `:`
        <div class="form-section" style="max-width: none; margin-bottom: var(--space-8);">
          <div class="form-section-title">✍️ New Post <span class="badge badge-pending" style="font-size: var(--text-xs);">Anonymous</span></div>
          <form id="forum-form" novalidate>
            <div class="form-group" style="margin-bottom: var(--space-4);">
              <label class="form-label" for="f-title">Title</label>
              <input type="text" class="form-input" id="f-title" placeholder="What's on your mind?" maxlength="120" required />
              <div class="form-error" id="err-f-title">Title is required</div>
            </div>
            <div class="form-group">
              <label class="form-label" for="f-content">Message</label>
              <textarea class="form-textarea" id="f-content" rows="3" placeholder="Speak freely — your identity is never stored." required></textarea>
              <div class="form-error" id="err-f-content">Message is required</div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary" id="btn-post">Post Anonymously</button>
              <button type="reset" class="btn btn-secondary">Clear</button>
            </div>
          </form>
        </div>
      `}

      <!-- Posts Feed -->
      <div id="forum-feed"></div>
      <div id="forum-empty" style="display:none; text-align:center; padding: var(--space-16); color: var(--text-tertiary);">
        No posts yet. Be the first to share!
      </div>
    </div>
  `;function i(){const n=document.getElementById("forum-feed"),c=document.getElementById("forum-empty");if(m.length===0){n.innerHTML="",c.style.display="block";return}c.style.display="none",n.innerHTML=m.map(d=>`
      <div class="forum-post card" style="background:var(--bg-primary); padding:var(--space-4); margin-bottom:var(--space-4); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
        <div class="forum-post-header" style="display:flex; align-items:center; gap:var(--space-3); margin-bottom:var(--space-2);">
          <div class="forum-avatar" style="font-size:24px; background:transparent; border:none;">${d.avatar_icon||"👤"}</div>
          <div>
            <div class="forum-post-title" style="font-weight:600; color:var(--text-primary);">${P(d.title)}</div>
            <div class="forum-post-meta" style="font-size:var(--text-xs); color:var(--text-tertiary);">${P(d.avatar_name||"Anonymous")} · ${te(d.created_at)}</div>
          </div>
        </div>
        <div class="forum-post-body" style="font-size:var(--text-sm); color:var(--text-secondary); line-height:1.6; margin-left:var(--space-10); margin-bottom:var(--space-3);">${P(d.content)}</div>
        
        <div class="forum-post-actions" style="margin-left:var(--space-10); display:flex; gap:var(--space-4); align-items:center; margin-bottom:var(--space-2);">
          <div style="display:flex; background:var(--bg-elevated); border-radius:var(--radius-sm); border:1px solid var(--border-subtle); overflow:hidden;">
            <button class="vote-btn" data-type="post" data-id="${d.post_id}" data-dir="up" style="background:transparent; border:none; padding:4px 8px; cursor:pointer; color:var(--text-secondary);">⇧ ${d.upvotes||0}</button>
            <div style="width:1px; background:var(--border-subtle);"></div>
            <button class="vote-btn" data-type="post" data-id="${d.post_id}" data-dir="down" style="background:transparent; border:none; padding:4px 8px; cursor:pointer; color:var(--text-secondary);">⇩ ${d.downvotes||0}</button>
          </div>
          ${r?"":`<button class="reply-toggle-btn" data-post-id="${d.post_id}" style="background:transparent; border:none; color:var(--text-tertiary); font-size:var(--text-xs); cursor:pointer; display:flex; gap:4px; align-items:center;">💬 Reply</button>`}
        </div>

        <!-- Replies -->
        ${d.replies&&d.replies.length>0?`
          <div class="forum-replies" style="margin-left:var(--space-10); border-left:2px solid var(--border-subtle); padding-left:var(--space-4); margin-top:var(--space-4); display:flex; flex-direction:column; gap:var(--space-4);">
            ${d.replies.map(e=>`
              <div class="forum-reply">
                <div class="forum-post-header" style="display:flex; align-items:center; gap:var(--space-2); margin-bottom:4px;">
                  <div class="forum-avatar" style="font-size:16px; background:transparent; border:none; width:auto; height:auto;">${e.avatar_icon||"👤"}</div>
                  <div class="forum-post-meta" style="font-size:var(--text-xs); color:var(--text-tertiary);">${P(e.avatar_name||"Anonymous")} · ${te(e.created_at)}</div>
                </div>
                <div class="forum-post-body" style="font-size:var(--text-sm); line-height:1.5; color:var(--text-secondary); margin-left:var(--space-6);">${P(e.content)}</div>
                <div class="forum-post-actions" style="margin-left:var(--space-6); display:flex; gap:var(--space-3); margin-top:4px;">
                  <div style="display:flex; background:var(--bg-elevated); border-radius:var(--radius-sm); border:1px solid var(--border-subtle); overflow:hidden;">
                    <button class="vote-btn" data-type="reply" data-id="${e.reply_id}" data-dir="up" style="background:transparent; border:none; padding:2px 6px; cursor:pointer; font-size:11px; color:var(--text-secondary);">⇧ ${e.upvotes||0}</button>
                    <div style="width:1px; background:var(--border-subtle);"></div>
                    <button class="vote-btn" data-type="reply" data-id="${e.reply_id}" data-dir="down" style="background:transparent; border:none; padding:2px 6px; cursor:pointer; font-size:11px; color:var(--text-secondary);">⇩ ${e.downvotes||0}</button>
                  </div>
                </div>
              </div>
            `).join("")}
          </div>
        `:""}

        <!-- Reply Form Content -->
        ${r?"":`
          <div id="reply-form-${d.post_id}" style="display:none; margin-left:var(--space-10); margin-top:var(--space-4);">
            <textarea id="reply-input-${d.post_id}" class="form-textarea" rows="2" placeholder="Write an anonymous reply..." style="padding:var(--space-2); min-height:60px;"></textarea>
            <div style="margin-top:var(--space-2); display:flex; gap:var(--space-2);">
              <button class="btn btn-primary reply-submit-btn" data-post-id="${d.post_id}" style="padding:4px 12px; font-size:12px;">Submit Reply</button>
              <button class="btn btn-secondary reply-toggle-btn" data-post-id="${d.post_id}" style="padding:4px 12px; font-size:12px;">Cancel</button>
            </div>
          </div>
        `}
      </div>
    `).join("")}if(document.getElementById("forum-feed").addEventListener("click",async n=>{const c=n.target.closest(".vote-btn");if(c&&!c.disabled){const p=c.dataset.type,s=c.dataset.id,b=c.dataset.dir;c.disabled=!0;try{const k=await $.patch("/forum/vote",{type:p,id:parseInt(s,10),dir:b});if(p==="post"){const u=m.find(y=>y.post_id===parseInt(s,10));u&&(u.upvotes=k.upvotes,u.downvotes=k.downvotes)}else for(const u of m)if(u.replies){const y=u.replies.find(x=>x.reply_id===parseInt(s,10));if(y){y.upvotes=k.upvotes,y.downvotes=k.downvotes;break}}i()}catch(k){B(k.message,"error"),c.disabled=!1}return}const d=n.target.closest(".reply-toggle-btn");if(d){const p=d.dataset.postId,s=document.getElementById(`reply-form-${p}`);s&&(s.style.display=s.style.display==="none"?"block":"none");return}const e=n.target.closest(".reply-submit-btn");if(e){const p=e.dataset.postId,s=document.getElementById(`reply-input-${p}`),b=s==null?void 0:s.value.trim();if(!b){B("Reply content cannot be empty","error");return}e.disabled=!0,e.textContent="...";try{const k=await $.post(`/forum/${p}/reply`,{content:b}),u=m.find(y=>y.post_id===parseInt(p,10));u&&(u.replies||(u.replies=[]),u.replies.push(k)),B("Reply posted","success"),i()}catch(k){B(k.message,"error"),e.disabled=!1,e.textContent="Submit Reply"}return}}),!r){const n=document.getElementById("forum-form");n.addEventListener("submit",async c=>{c.preventDefault();let d=!0;t.querySelectorAll(".form-error").forEach(b=>b.classList.remove("visible"));const e=document.getElementById("f-title").value.trim(),p=document.getElementById("f-content").value.trim();if(e||(document.getElementById("err-f-title").classList.add("visible"),d=!1),p||(document.getElementById("err-f-content").classList.add("visible"),d=!1),!d)return;const s=document.getElementById("btn-post");s.disabled=!0,s.textContent="Posting…";try{m=[await $.post("/forum",{title:e,content:p}),...m],B("Posted anonymously!","success"),n.reset(),i()}catch(b){B(b.message,"error")}finally{s.disabled=!1,s.textContent="Post Anonymously"}}),n.addEventListener("reset",()=>t.querySelectorAll(".form-error").forEach(c=>c.classList.remove("visible")))}i(),requestAnimationFrame(()=>{var n;return(n=document.getElementById("forum-page"))==null?void 0:n.classList.replace("page-enter","page-active")})}function P(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function te(t){try{return new Date(t).toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}catch{return t}}const ae=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],Ie={breakfast:[["Poori Chole","Matter Kulcha","Kachori Bhaji","Dosa Sambar","Pav Bhaji","Macaroni","Aloo Paratha"],["Chacos","Idli Sambar","Daliya","Chana Chaat","Corn Flakes","Idli Sambar","Cut Fruits"],["Egg","Banana","Egg","—","Egg","—","—"],["Tea / Coffee","Tea / Coffee","Tea / Coffee","Tea / Coffee","Tea / Coffee","Tea / Coffee","Tea / Coffee"],["Bread & Jam","Bread & Jam","Bread & Jam","Bread & Jam","Bread & Jam","Bread & Jam","Bread & Jam"]],lunch:[["Green Salad","Green Salad","Green Salad","Green Salad","Green Salad","Green Salad","Green Salad"],["Boondi Raita","Mix Veg Raita","Lauki Raita","Mix Veg Raita","Boondi Raita","Mix Veg Raita","Mint Raita"],["A / P / C","A / P / C","A / P / C","A / P / C","A / P / C","A / P / C","A / P / C"],["Mix Dal Tadka","Chole Masala","Kadi Pakora","Lobhiya / Masoor Dal","Rajma Masala","Dal Makhani","Dal Tadka"],["Matar Paneer","Aloo Nutrela","Mixed Vegetable","Paneer Do Pyaza","Handi Kofta Curry","Aloo Gobhi Masala","Chap Masala"],["Aloo Palak","Boiled Rice","Soya Chap Gravy","Boiled Rice","Boiled Rice","Boiled Rice","Veg Biryani"],["Boiled Rice","Chapathi","Jeera Rice","Cut Fruits","Chapathi","Chapathi","Chapathi"],["Chapathi","Ice Cream","Chapathi","Chapathi","—","Besan Barfi","Fruit Custard"]],hitea:[["Tea / Coffee","Tea / Coffee","Tea / Coffee","Tea / Coffee","Tea / Coffee","Tea / Coffee","Tea / Coffee"],["Veg Hakka Noodles","Bhaji Pakora","Veg Sandwich","Bread Pakora","Cake Slice","Potato Wedges","Aloo Sandwich"]],dinner:[["Green Salad","Green Salad","Green Salad","Green Salad","Green Salad","Green Salad","Green Salad"],["Dal Bukhara","Curd","Rajma Masala","Curd","Dal Palak","Khichdi","Curd"],["Veg Jalfrezi","Arhar Dal Fry","Palak Paneer","Mix Dal Tadka","Soya Matar Masala","Mix Vegetable","Dal Dhaba"],["Jeera Pulao","Crispy Veg Sweet Chilly","Onion Pulao","Aloo Chole","Tomato Rice","Chapati","Paneer Lababdar"],["Chapathi","Aloo Jeera","Chapathi","Masala Rice","Chapathi","Hot Milk","Jeera Pulao"],["Milk","Soya Biryani","Milk","Chapathi","Milk","—","Chapathi"],["Rice Kheer","Chapathi","Fruit Custard","Milk","Boondi","—","Milk"]]},Me=[{key:"breakfast",label:"Breakfast",time:"7:30 – 9:30 AM"},{key:"lunch",label:"Lunch",time:"12:30 – 2:30 PM"},{key:"hitea",label:"Evening Hi-Tea",time:"5:00 – 6:30 PM"},{key:"dinner",label:"Dinner",time:"7:30 – 9:30 PM"}];function Ae(){const t=new Date().getDay();return t===0?6:t-1}function Te(){const t=new Date().getHours();return t<10?"breakfast":t<15?"lunch":t<19?"hitea":"dinner"}async function qe(t){t.innerHTML='<div class="page-loading">Loading…</div>';let a=[];try{a=await $.get("/resources")}catch{}ze(t,a)}function ze(t,a){const r=Ae();let m=Te(),i=r;if(t.innerHTML=`
    <div class="page-enter" id="res-page" style="max-width:1200px;">

      <!-- Header -->
      <div class="page-header">
        <h2>Resources</h2>
        <p style="color:var(--text-tertiary);">Everything you need — menu, health, services.</p>
      </div>

      <!-- ═══════════════════════════════════════
           MESS MENU
      ═══════════════════════════════════════ -->
      <section style="margin-bottom: var(--space-12);">
        <div class="res-section-label">Mess Menu</div>

        <!-- Meal selector -->
        <div style="display:flex; gap:var(--space-2); margin-bottom:var(--space-6); border-bottom:1px solid var(--border-subtle); padding-bottom:var(--space-4);" id="meal-tabs">
          ${Me.map(n=>`
            <button data-meal="${n.key}" class="res-meal-tab${n.key===m?" active":""}">
              <span class="res-meal-name">${n.label}</span>
              <span class="res-meal-time">${n.time}</span>
            </button>
          `).join("")}
        </div>

        <!-- Day selector -->
        <div style="display:flex; gap:var(--space-2); margin-bottom:var(--space-5); flex-wrap:wrap;" id="day-tabs">
          ${ae.map((n,c)=>`
            <button class="res-day-tab${c===i?" active":""}" data-day="${c}">
              ${n.slice(0,3)}${c===r?" ·":""}
            </button>
          `).join("")}
        </div>

        <!-- Menu table -->
        <div id="menu-panel" style="overflow-x:auto;"></div>

        <!-- Live counter note -->
        <p style="margin-top:var(--space-5); font-size:var(--text-xs); color:var(--text-tertiary); padding:var(--space-3) var(--space-4); background:var(--bg-elevated); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
          One Friday/month — Live counter: Tandoor / Poori &nbsp;·&nbsp; Matar Paneer &nbsp;·&nbsp; One Sweet
        </p>
      </section>

      <!-- ═══════════════════════════════════════
           INFO GRID  (pharmacy / hospital / laundry / canteens)
      ═══════════════════════════════════════ -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-6); margin-bottom:var(--space-12);">

        <!-- Pharmacy -->
        ${j("Pharmacy",`
          <div class="res-info-block">
            <div class="res-info-place">Campus Pharmacy</div>
            <div class="res-info-line">Ground Floor, OPD Block, Amrita Hospital</div>
            <div class="res-info-line">Mon – Sat &nbsp; 8 AM – 9 PM &nbsp; · &nbsp; Sun 9 AM – 6 PM</div>
            <a href="tel:01294090000" class="res-phone">0129-409-0000</a>
          </div>
          <div class="res-info-block" style="margin-top:var(--space-6); padding-top:var(--space-6); border-top:1px solid var(--border-subtle);">
            <div class="res-info-place">24-Hour Emergency Pharmacy</div>
            <div class="res-info-line">Emergency Block, Ground Floor &nbsp;·&nbsp; Open 24 × 7</div>
            <a href="tel:01294090911" class="res-phone">0129-409-0911</a>
          </div>
        `)}

        <!-- Hospital Booking -->
        ${j("Hospital Appointment",`
          <div class="res-info-block">
            <div class="res-info-place">Amrita Hospital Faridabad</div>
            <div class="res-info-line" style="margin-bottom:var(--space-5);">Book OPD appointments online via the Amrita patient portal.</div>
            <a href="https://www.amritahospitals.org/faridabad/book-appointment"
               target="_blank" rel="noopener" class="res-book-btn">
              Book Appointment
            </a>
          </div>
          <div class="res-info-block" style="margin-top:var(--space-6); padding-top:var(--space-6); border-top:1px solid var(--border-subtle);">
            <div class="res-info-place">Appointment Helpline</div>
            <div class="res-info-line">Mon – Sat &nbsp; 8 AM – 6 PM</div>
            <a href="tel:01294090100" class="res-phone">0129-409-0100</a>
            <a href="tel:18001024647" class="res-phone" style="margin-top:var(--space-1);">1800-102-4647 &nbsp;<span style="font-weight:400;opacity:.6;">Toll Free</span></a>
          </div>
        `)}

        <!-- Laundry -->
        ${j("Laundry",`
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-6);">
            <div>
              <div class="res-info-place" style="margin-bottom:var(--space-4);">Collection</div>
              ${[["Monday","Boys Hostel (Senior MBBS)"],["Wednesday","Girls Hostel (Senior MBBS)"]].map(([n,c])=>`<div class="res-laundry-row"><span>${n}</span><span>${c}</span></div>`).join("")}
            </div>
            <div>
              <div class="res-info-place" style="margin-bottom:var(--space-4);">Delivery</div>
              ${[["Thursday","Boys Hostel (Senior MBBS)"],["Saturday","Girls Hostel (Senior MBBS)"]].map(([n,c])=>`<div class="res-laundry-row"><span>${n}</span><span>${c}</span></div>`).join("")}
            </div>
          </div>
          <div class="res-info-block" style="margin-top:var(--space-6); padding-top:var(--space-6); border-top:1px solid var(--border-subtle);">
            <div class="res-info-line">Label all items with name & roll number. Dry-clean items separately.</div>
            <a href="tel:9999000001" class="res-phone" style="margin-top:var(--space-3);">9999-000-001</a>
          </div>
        `)}

        <!-- Canteens -->
        ${j("Canteens",`
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-6);">
            <div>
              <div class="res-info-place">Oasis — Day</div>
              <div class="res-info-line" style="margin-top:var(--space-2);">10 AM – 5 PM</div>
              <div class="res-info-line">Min ₹50 · UPI / Cash</div>
              <a href="tel:9876540001" class="res-phone" style="margin-top:var(--space-3);">98765-40001</a>
              <a href="tel:9876540002" class="res-phone" style="margin-top:var(--space-1);">98765-40002</a>
            </div>
            <div style="padding-left:var(--space-6); border-left:1px solid var(--border-subtle);">
              <div class="res-info-place">NT1 — Night</div>
              <div class="res-info-line" style="margin-top:var(--space-2);">9:30 PM – 1 AM</div>
              <div class="res-info-line">UPI / Cash</div>
              <a href="tel:9876540010" class="res-phone" style="margin-top:var(--space-3);">98765-40010</a>
              <a href="tel:9876540011" class="res-phone" style="margin-top:var(--space-1);">98765-40011</a>
            </div>
          </div>
        `)}

      </div>

      <!-- ═══════════════════════════════════════
           CONTACTS (from DB)
      ═══════════════════════════════════════ -->
      ${a.length>0?`
        <section>
          <div class="res-section-label" style="margin-bottom:var(--space-5);">Staff Directory</div>
          <div id="contacts-body">${Re(a)}</div>
        </section>
      `:""}

    </div>
  `,!document.getElementById("res-styles")){const n=document.createElement("style");n.id="res-styles",n.textContent=`
      .res-section-label {
        font-size: var(--text-xs);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: .1em;
        color: var(--text-tertiary);
        margin-bottom: var(--space-6);
      }

      /* Meal tabs */
      .res-meal-tab {
        display: flex; flex-direction: column;
        padding: var(--space-4) var(--space-6);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-md);
        background: var(--bg-elevated);
        cursor: pointer;
        transition: all .15s;
        text-align: left;
        gap: 4px;
        min-width: 140px;
      }
      .res-meal-tab:hover { border-color: var(--border-default); }
      .res-meal-tab.active {
        border-color: var(--text-primary);
        background: var(--text-primary);
        color: var(--text-inverse);
      }
      .res-meal-name { font-size: var(--text-sm); font-weight: 600; }
      .res-meal-time { font-size: 11px; opacity: .6; }
      .res-meal-tab.active .res-meal-time { opacity: .7; }

      /* Day tabs */
      .res-day-tab {
        padding: 6px 14px;
        font-size: var(--text-xs);
        font-weight: 500;
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-full, 999px);
        background: transparent;
        color: var(--text-tertiary);
        cursor: pointer;
        transition: all .15s;
      }
      .res-day-tab:hover { color: var(--text-primary); border-color: var(--border-default); }
      .res-day-tab.active {
        background: var(--text-primary);
        color: var(--text-inverse);
        border-color: transparent;
      }

      /* Big info cards */
      .res-big-card {
        background: var(--bg-elevated);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-lg);
        padding: var(--space-8);
        display: flex;
        flex-direction: column;
      }
      .res-card-title {
        font-size: var(--text-xs);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: .1em;
        color: var(--text-tertiary);
        margin-bottom: var(--space-6);
        padding-bottom: var(--space-4);
        border-bottom: 1px solid var(--border-subtle);
      }
      .res-info-block { display: flex; flex-direction: column; }
      .res-info-place {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: var(--space-2);
      }
      .res-info-line {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
        line-height: 1.6;
      }
      .res-phone {
        display: inline-block;
        font-size: var(--text-sm);
        font-family: var(--font-mono);
        font-weight: 600;
        color: var(--text-primary);
        text-decoration: none;
        margin-top: var(--space-3);
      }
      .res-phone:hover { opacity: .7; }
      .res-book-btn {
        display: inline-flex;
        align-items: center;
        padding: 10px 20px;
        background: var(--text-primary);
        color: var(--text-inverse);
        border-radius: var(--radius-md);
        font-size: var(--text-sm);
        font-weight: 600;
        text-decoration: none;
        transition: opacity .15s;
        align-self: flex-start;
      }
      .res-book-btn:hover { opacity: .75; }

      /* Laundry rows */
      .res-laundry-row {
        display: flex;
        flex-direction: column;
        margin-bottom: var(--space-4);
      }
      .res-laundry-row > span:first-child {
        font-size: var(--text-xs);
        font-weight: 600;
        color: var(--text-primary);
        text-transform: uppercase;
        letter-spacing: .04em;
      }
      .res-laundry-row > span:last-child {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
        margin-top: 2px;
      }

      /* Menu table */
      #menu-panel table {
        width: 100%;
        border-collapse: collapse;
        border-radius: var(--radius-lg);
        overflow: hidden;
        border: 1px solid var(--border-subtle);
      }
      #menu-panel th {
        padding: 12px 14px;
        font-size: var(--text-xs);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: .06em;
        text-align: center;
        background: var(--bg-elevated);
        color: var(--text-tertiary);
        border-bottom: 1px solid var(--border-subtle);
      }
      #menu-panel th.today {
        background: var(--text-primary);
        color: var(--text-inverse);
      }
      #menu-panel td {
        padding: 10px 14px;
        font-size: var(--text-xs);
        text-align: center;
        color: var(--text-secondary);
        border-bottom: 1px solid var(--border-subtle);
        text-transform: uppercase;
        letter-spacing: .02em;
      }
      #menu-panel td.today {
        color: var(--text-primary);
        font-weight: 600;
        background: rgba(0,0,0,.02);
      }
      [data-theme="dark"] #menu-panel td.today { background: rgba(255,255,255,.03); }
      #menu-panel tr:last-child td { border-bottom: none; }

      /* Contact directory */
      .res-dir { display: flex; flex-direction: column; }
      .res-dir-group { margin-bottom: var(--space-8); }
      .res-dir-cat {
        font-size: 10px; font-weight: 700; text-transform: uppercase;
        letter-spacing: .12em; color: var(--text-tertiary);
        padding-bottom: var(--space-3);
        border-bottom: 1px solid var(--border-subtle);
        margin-bottom: var(--space-4);
      }
      .res-dir-row {
        display: flex; align-items: baseline;
        justify-content: space-between; flex-wrap: wrap;
        gap: var(--space-2) var(--space-6);
        padding: var(--space-4) 0;
        border-bottom: 1px solid var(--border-subtle);
      }
      .res-dir-row:last-child { border-bottom: none; }
      .res-dir-name {
        font-size: var(--text-sm); font-weight: 600;
        color: var(--text-primary); flex-shrink: 0;
      }
      .res-dir-note {
        font-size: var(--text-xs); color: var(--text-tertiary);
        margin-top: 2px;
      }
      .res-dir-contacts {
        display: flex; align-items: center; gap: var(--space-4);
        flex-shrink: 0; flex-wrap: wrap;
      }
      .res-dir-phone {
        font-size: var(--text-xs); font-family: var(--font-mono);
        font-weight: 600; color: var(--text-primary);
        text-decoration: none; white-space: nowrap;
      }
      .res-dir-phone:hover { opacity: .65; }
      .res-dir-email {
        font-size: var(--text-xs); color: var(--text-tertiary);
        text-decoration: none; white-space: nowrap;
      }
      .res-dir-email:hover { color: var(--text-primary); }

      @media (max-width: 768px) {
        .res-big-grid { grid-template-columns: 1fr !important; }
      }
    `,document.head.appendChild(n)}function o(){const n=Ie[m],c=document.getElementById("menu-panel");c&&(c.innerHTML=`
      <table>
        <thead>
          <tr>
            ${ae.map((d,e)=>`<th class="${e===i?"today":""}">${d}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${n.map(d=>`
            <tr>
              ${d.map((e,p)=>`<td class="${p===i?"today":""}">${e}</td>`).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    `)}document.getElementById("meal-tabs").querySelectorAll(".res-meal-tab").forEach(n=>{n.addEventListener("click",()=>{document.getElementById("meal-tabs").querySelectorAll(".res-meal-tab").forEach(c=>c.classList.remove("active")),n.classList.add("active"),m=n.dataset.meal,o()})}),document.getElementById("day-tabs").querySelectorAll(".res-day-tab").forEach(n=>{n.addEventListener("click",()=>{document.getElementById("day-tabs").querySelectorAll(".res-day-tab").forEach(c=>c.classList.remove("active")),n.classList.add("active"),i=+n.dataset.day,o()})}),o(),requestAnimationFrame(()=>{var n;return(n=document.getElementById("res-page"))==null?void 0:n.classList.replace("page-enter","page-active")})}function j(t,a){return`
    <div class="res-big-card">
      <div class="res-card-title">${t}</div>
      ${a}
    </div>
  `}function Re(t){const a=["Authority","Electrician","Plumber","WiFi","Other"],r={Authority:"Authority",Electrician:"Electrician",Plumber:"Plumber",WiFi:"Wi-Fi / IT",Other:"Other"},m={};return t.forEach(o=>{(m[o.category]=m[o.category]||[]).push(o)}),`<div class="res-dir">${[...a.filter(o=>m[o]),...Object.keys(m).filter(o=>!a.includes(o))].map(o=>`
    <div class="res-dir-group">
      <div class="res-dir-cat">${r[o]||o}</div>
      ${m[o].map(n=>`
        <div class="res-dir-row">
          <div>
            <div class="res-dir-name">${n.name}</div>
            ${n.notes?`<div class="res-dir-note">${n.notes}</div>`:""}
          </div>
          <div class="res-dir-contacts">
            ${n.phone?`<a class="res-dir-phone" href="tel:${n.phone}">${n.phone}</a>`:""}
            ${n.email?`<a class="res-dir-email" href="mailto:${n.email}">${n.email}</a>`:""}
          </div>
        </div>
      `).join("")}
    </div>
  `).join("")}</div>`}const V="ahcms_hostel_filter";function Q(){return localStorage.getItem(V)||""}function me(t){t?localStorage.setItem(V,t):localStorage.removeItem(V),window.dispatchEvent(new CustomEvent("hostel-change",{detail:t}))}function X(t){window.addEventListener("hostel-change",a=>t(a.detail))}async function Pe(t){let a=[];async function r(){t.innerHTML='<div class="page-loading">Loading</div>';try{const i=Q(),o=i?`?hostel=${encodeURIComponent(i)}`:"",[n,c]=await Promise.all([$.get(`/dashboard/admin${o}`),$.get("/rooms")]);a=[...new Set(c.map(d=>d.hostel))].sort(),m(t,n,a,i)}catch(i){t.innerHTML=`<div class="page-error">Failed to load: ${i.message}</div>`}}X(()=>r()),await r();function m(i,{stats:o,recentComplaints:n,wardens:c,wardenOfficePhone:d},e,p){const s=c.filter(u=>u.role==="Warden"),b=c.filter(u=>u.role==="Guard"),k=o.totalCapacity>0?Math.round(o.totalOccupied/o.totalCapacity*100):0;i.innerHTML=`
      <div class="page-enter" id="admin-home">
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:var(--space-4);">
          <div>
            <h2>Admin Dashboard</h2>
            <p>System-wide overview — occupancy, complaints, and on-duty staff.</p>
          </div>
          <div class="hostel-filter-bar">
            <label class="hostel-filter-label">Hostel</label>
            <select class="hostel-filter-select" id="hostel-filter">
              <option value="">All Hostels</option>
              ${e.map(u=>`<option value="${u}" ${u===p?"selected":""}>${He(u)}</option>`).join("")}
            </select>
          </div>
        </div>

        <!-- Stat Cards -->
        <div class="card-grid">
          <div class="card card-accent-blue">
            <div class="card-label">Total Rooms</div>
            <div class="card-value">${o.totalRooms}</div>
            <div class="card-sub">${o.vacantRooms} vacant · ${k}% utilized</div>
          </div>
          <div class="card card-accent-amber">
            <div class="card-label">Open Complaints</div>
            <div class="card-value">${o.openComplaints}</div>
            <div class="card-sub">${o.inProgressComplaints} in progress</div>
          </div>
          <div class="card card-accent-green">
            <div class="card-label">Resolved</div>
            <div class="card-value">${o.resolvedComplaints}</div>
            <div class="card-sub">complaints closed</div>
          </div>
          <div class="card card-accent-purple">
            <div class="card-label">Students</div>
            <div class="card-value">${o.totalStudents}</div>
            <div class="card-sub">${o.pendingBookings} pending bookings</div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-6);">
          <!-- Wardens & Guards -->
          <div class="form-section" style="max-width:none;">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:var(--space-2); margin-bottom:var(--space-4);">
              <div class="form-section-title" style="margin-bottom:0;">On-Duty Wardens</div>
              ${d?`
                <a href="tel:${d}" style="
                  display:inline-flex; align-items:center; gap:6px;
                  background:color-mix(in srgb,var(--accent-green) 12%,transparent);
                  border:1px solid color-mix(in srgb,var(--accent-green) 30%,transparent);
                  color:var(--accent-green); font-size:var(--text-xs); font-weight:600;
                  letter-spacing:.04em; padding:4px 10px; border-radius:999px;
                  text-decoration:none; transition:background .15s;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Office: ${d}
                </a>`:""}
            </div>
            ${s.length===0?'<p class="empty-msg">No warden data available.</p>':s.map(u=>`
              <div class="contact-row" style="align-items:flex-start;">
                <div class="contact-avatar">${u.name[0]}</div>
                <div class="contact-info" style="flex:1;">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:2px;">
                    <div class="contact-name">${u.name}</div>
                    <a href="tel:${u.phone}" class="contact-phone" style="margin-left:auto;">${u.phone||""}</a>
                  </div>
                  <div class="contact-meta">${u.hostel} · ${u.email||""}</div>
                  <div style="display:flex; flex-wrap:wrap; gap:12px; font-size:11px; margin-top:8px; padding-top:8px; border-top:1px solid var(--border-subtle); color:var(--text-secondary);">
                    <span><span style="font-weight:600; color:var(--text-tertiary);">Last:</span> ${u.previous?u.previous.name:"Unknown"}</span>
                    <span style="color:var(--accent-green);"><span style="font-weight:600;">Current:</span> Active</span>
                    <span><span style="font-weight:600; color:var(--text-tertiary);">Next:</span> ${u.next?u.next.name:"Unknown"}</span>
                  </div>
                </div>
              </div>
            `).join("")}
            <div class="form-section-title" style="margin-top:var(--space-5);">On-Duty Guards</div>
            ${b.length===0?'<p class="empty-msg">No guard data.</p>':b.map(u=>`
              <div class="contact-row">
                <div class="contact-avatar guard">${u.name[0]}</div>
                <div class="contact-info">
                  <div class="contact-name">${u.name}</div>
                  <div class="contact-meta">${u.hostel} · ${u.shift} shift</div>
                </div>
                <a href="tel:${u.phone}" class="contact-phone">${u.phone||""}</a>
              </div>
            `).join("")}
          </div>

          <!-- Recent Complaints -->
          <div class="form-section" style="max-width:none;">
            <div class="form-section-title">Recent Complaints</div>
            ${n.length===0?'<p class="empty-msg">No recent complaints.</p>':`
            <div class="activity-list">
              ${n.map(u=>`
                  <div class="activity-item">
                    <div class="activity-dot" style="background:${u.status==="open"?"var(--accent-amber)":u.status==="in-progress"?"var(--accent-blue)":"var(--accent-green)"}"></div>
                    <div class="activity-content">
                      <div class="activity-text">
                        <strong>${u.student_name||u.student_id}</strong> · ${u.category}
                        <span class="badge badge-${u.status}">${u.status}</span>
                      </div>
                      <div class="activity-time">${u.date} · ${u.room_id||""}</div>
                    </div>
                  </div>
                `).join("")}
            </div>
            `}
            <a class="link-accent" href="#complaints" style="display:block; margin-top:var(--space-4); font-size:var(--text-sm);">Manage all complaints →</a>
          </div>
        </div>

        <!-- Occupancy Bar -->
        <div class="form-section" style="max-width:none; margin-top:var(--space-6);">
          <div class="form-section-title">Occupancy Overview</div>
          <div class="occ-overview">
            <div class="occ-track-outer">
              <div class="occ-track-inner" style="width:${k}%"></div>
            </div>
            <span style="font-size:var(--text-sm); color:var(--text-secondary);">${o.totalOccupied} / ${o.totalCapacity} beds · ${k}%</span>
          </div>
          <div class="card-grid" style="margin-top:var(--space-4); margin-bottom:0;">
            <div class="card" style="text-align:center;">
              <div class="card-label">Total Beds</div>
              <div class="card-value" style="font-size:var(--text-2xl);">${o.totalCapacity}</div>
            </div>
            <div class="card" style="text-align:center;">
              <div class="card-label">Occupied</div>
              <div class="card-value" style="font-size:var(--text-2xl);">${o.totalOccupied}</div>
            </div>
            <div class="card" style="text-align:center;">
              <div class="card-label">Vacant</div>
              <div class="card-value" style="font-size:var(--text-2xl); color:var(--accent-green);">${o.totalCapacity-o.totalOccupied}</div>
            </div>
          </div>
        </div>
      </div>
    `,document.getElementById("hostel-filter").addEventListener("change",u=>{me(u.target.value),r()}),i.querySelectorAll('a.link-accent[href^="#"]').forEach(u=>{u.addEventListener("click",y=>{y.preventDefault(),window.location.hash=u.getAttribute("href").slice(1)})}),requestAnimationFrame(()=>{var u;return(u=document.getElementById("admin-home"))==null?void 0:u.classList.replace("page-enter","page-active")})}}function He(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const q=t=>`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;opacity:.6;vertical-align:middle;">${t}</svg>`,Fe={Plumbing:q('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),Electricity:q('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'),WiFi:q('<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>'),Cleanliness:q('<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'),Carpentry:q('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),Other:q('<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>')},oe=["open","in-progress","resolved"],je=["Plumbing","Electricity","WiFi","Cleanliness","Carpentry","Other"];async function De(t){async function a(){t.innerHTML='<div class="page-loading">Loading…</div>';try{const r=Q(),m=r?`?hostel=${encodeURIComponent(r)}`:"",i=await $.get(`/complaints${m}`);Ne(t,i,a)}catch(r){t.innerHTML=`<div class="page-error">Failed to load: ${r.message}</div>`}}X(()=>a()),await a()}function Ne(t,a,r){let m=a,i="all",o="",n=null;t.innerHTML=`
    <div class="page-enter" id="admin-complaints-page">
      <div class="page-header">
        <h2>Complaints Management</h2>
        <p>Review, approve, and update status of all hostel complaints.</p>
      </div>

      <!-- Summary chips -->
      <div class="card-grid" style="margin-bottom: var(--space-6);">
        <div class="card" style="text-align:center; cursor:pointer;" data-quick="all">
          <div class="card-label">Total</div>
          <div class="card-value" style="font-size:var(--text-2xl);">${m.length}</div>
        </div>
        ${oe.map(e=>{const p=m.filter(b=>b.status===e).length;return`<div class="card card-accent-${e==="open"?"amber":e==="in-progress"?"blue":"green"}" style="text-align:center; cursor:pointer;" data-quick="${e}">
            <div class="card-label">${e}</div>
            <div class="card-value" style="font-size:var(--text-2xl);">${p}</div>
          </div>`}).join("")}
      </div>

      <div class="table-container">
        <div class="table-toolbar">
          <div class="table-toolbar-title">All Complaints</div>
          <div style="display:flex; gap: var(--space-2); flex-wrap: wrap; align-items: center;">
            <select class="form-select" id="cat-filter" style="width: auto; padding: 4px 28px 4px 10px; font-size: var(--text-xs);">
              <option value="">All Categories</option>
              ${je.map(e=>`<option value="${e}">${e}</option>`).join("")}
            </select>
            <button class="filter-chip active" data-status="all">All</button>
            ${oe.map(e=>`<button class="filter-chip" data-status="${e}">${e}</button>`).join("")}
          </div>
        </div>
        <div id="complaints-body"></div>
      </div>
    </div>
  `;function c(){let e=m;return o&&(e=e.filter(p=>p.category===o)),i!=="all"&&(e=e.filter(p=>p.status===i)),e}function d(){const e=c(),p=document.getElementById("complaints-body");if(e.length===0){p.innerHTML='<p style="padding:var(--space-8); text-align:center; color:var(--text-tertiary);">No complaints match the current filter.</p>';return}p.innerHTML=`
      <table>
        <thead>
          <tr>
            <th>#</th><th>Student</th><th>Room</th><th>Category</th>
            <th>Description</th><th>Date</th><th>Status</th><th>Action</th>
          </tr>
        </thead>
        <tbody id="cmp-tbody">
          ${e.map(s=>`
            <tr class="cmp-row${n===s.complaint_id?" expanded-row":""}" data-id="${s.complaint_id}">
              <td class="cell-mono">${s.complaint_id}</td>
              <td><div>${s.student_name||s.student_id}</div><div style="font-size:var(--text-xs); color:var(--text-tertiary);">${s.roll_no||""}</div></td>
              <td class="cell-mono">${s.room_id||"—"}</td>
              <td><span style="display:inline-flex;align-items:center;gap:5px;">${Fe[s.category]||""} ${s.category}</span></td>
              <td style="max-width:180px; overflow:hidden; text-overflow:ellipsis;" title="${s.description}">${s.description.slice(0,45)}${s.description.length>45?"…":""}</td>
              <td class="cell-mono">
                <div>${s.date}</div>
                ${s.resolved_date?`<div style="font-size:10px; color:var(--accent-green); margin-top:2px;">Res: ${s.resolved_date}</div>`:""}
              </td>
              <td><span class="badge badge-${s.status}">${s.status}</span></td>
              <td>
                ${s.status!=="resolved"?`
                  <div style="display:flex; gap:4px;">
                    ${s.status==="open"?`<button class="btn btn-sm btn-secondary" data-action="in-progress" data-id="${s.complaint_id}">Start</button>`:""}
                    <button class="btn btn-sm btn-primary" data-action="resolved" data-id="${s.complaint_id}">Resolve</button>
                  </div>
                `:'<span style="color:var(--text-tertiary); font-size:var(--text-xs);">Done</span>'}
              </td>
            </tr>
            ${s.photo_base64?`
              <tr class="photo-row" data-for="${s.complaint_id}" style="${n===s.complaint_id?"":"display:none"}">
                <td colspan="8" style="padding: var(--space-3) var(--space-6); background: var(--bg-elevated);">
                  <img src="${s.photo_base64}" alt="Complaint photo" style="max-width:280px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);" />
                  ${s.admin_note?`<p style="font-size:var(--text-xs); color:var(--text-secondary); margin-top: var(--space-2);">Note: ${s.admin_note}</p>`:""}
                </td>
              </tr>
            `:""}
          `).join("")}
        </tbody>
      </table>
    `,p.querySelectorAll("[data-action]").forEach(s=>{s.addEventListener("click",async()=>{const b=+s.dataset.id,k=s.dataset.action;s.disabled=!0;try{const u=await $.patch(`/complaints/${b}/status`,{status:k});m=m.map(y=>y.complaint_id===b?{...y,...u}:y),B(`Complaint #${b} → ${k}`,"success"),d()}catch(u){B(u.message,"error"),s.disabled=!1}})}),p.querySelectorAll(".cmp-row").forEach(s=>{s.addEventListener("click",()=>{const b=+s.dataset.id;n=n===b?null:b,d()})})}t.querySelectorAll("[data-status]").forEach(e=>{e.addEventListener("click",()=>{t.querySelectorAll("[data-status]").forEach(p=>p.classList.remove("active")),e.classList.add("active"),i=e.dataset.status,d()})}),t.querySelectorAll("[data-quick]").forEach(e=>{e.addEventListener("click",()=>{var p;i=e.dataset.quick,t.querySelectorAll("[data-status]").forEach(s=>s.classList.remove("active")),(p=t.querySelector(`[data-status="${i}"]`))==null||p.classList.add("active"),d()})}),document.getElementById("cat-filter").addEventListener("change",e=>{o=e.target.value,d()}),d(),requestAnimationFrame(()=>{var e;return(e=document.getElementById("admin-complaints-page"))==null?void 0:e.classList.replace("page-enter","page-active")})}const I=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),Oe=["Senior MBBS boys hostel","Senior MBBS girls hostel"],U={"M-MBBS":{hostel:"Senior MBBS boys hostel",floor:8},"M-B.Tech":{hostel:"Senior MBBS boys hostel",floor:9},"F-MBBS":{hostel:"Senior MBBS girls hostel",floor:7},"F-B.Tech":{hostel:"Senior MBBS girls hostel",floor:8}};function re(t,a,r){const m=a&&r?`${a}-${r}`:null,i=m?U[m]:null;return t.filter(o=>{if(o.current_occupancy>=o.capacity)return!1;if(!i){const n=a==="M"?"boys":a==="F"?"girls":"";return n?o.hostel.toLowerCase().includes(n):!0}return o.hostel===i.hostel&&o.floor===i.floor}).sort((o,n)=>o.room_id.localeCompare(n.room_id))}function se(t){return`<option value="${t.room_id}">${t.room_id} · Fl ${t.floor} · ${t.type} · ${t.current_occupancy}/${t.capacity}</option>`}async function Ge(t){async function a(){t.innerHTML='<div class="page-loading">Loading…</div>';try{const[r,m,i,o,n]=await Promise.all([$.get("/rooms"),$.get("/rooms/booking-requests"),$.get("/rooms/change-requests"),$.get("/rooms/allocations"),$.get("/students")]);Ve(t,{rooms:r,bookReqs:m,changeReqs:i,allocs:o,students:n},a)}catch(r){t.innerHTML=`<div class="page-error">Failed to load: ${r.message}</div>`}}X(()=>a()),await a()}function Ve(t,a,r){const{rooms:m,bookReqs:i,changeReqs:o,students:n}=a;let c="grid",d=Q();const e=i.filter(y=>y.status==="pending").length+o.filter(y=>y.status==="pending").length;t.innerHTML=`
    <style>
      /* corridor layout */
      .floor-corridor { display:flex; flex-direction:column; gap:3px; margin-bottom:var(--space-5); }
      .corridor-row { display:grid; grid-template-columns:repeat(5,1fr); gap:5px; }
      .corridor-strip { display:flex; align-items:center; gap:8px; padding:3px 0; }
      .corridor-strip-line { flex:1; height:1px; background:var(--border-subtle); }
      .corridor-strip-label { font-size:9px; letter-spacing:.1em; color:var(--text-tertiary); text-transform:uppercase; }
      /* room cells */
      .room-cell {
        border-radius:8px; padding:10px 4px 8px; display:flex; flex-direction:column;
        align-items:center; justify-content:center; font-size:10px; font-weight:600;
        line-height:1.3; text-align:center; border:1px solid transparent;
        transition:transform .12s, box-shadow .12s; cursor:default;
      }
      .room-cell:hover { transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,.3); }
      .room-cell.vacant  { background:color-mix(in srgb,var(--accent-green) 10%,transparent); border-color:color-mix(in srgb,var(--accent-green) 25%,transparent); color:var(--accent-green); }
      .room-cell.partial { background:color-mix(in srgb,var(--accent-amber) 10%,transparent); border-color:color-mix(in srgb,var(--accent-amber) 25%,transparent); color:var(--accent-amber); }
      .room-cell.full    { background:color-mix(in srgb,var(--accent-red) 10%,transparent);   border-color:color-mix(in srgb,var(--accent-red) 25%,transparent);   color:var(--accent-red); opacity:.65; }
      .rc-id { font-family:var(--font-mono); font-size:9px; opacity:.7; }
      /* minimal tabs */
      #rm-tabs { display:flex; gap:var(--space-6); border-bottom:1px solid var(--border-subtle); margin-bottom:var(--space-6); }
      #rm-tabs button {
        background:none; border:none; border-bottom:2px solid transparent;
        padding:8px 0; font-size:var(--text-sm); font-weight:500;
        color:var(--text-tertiary); cursor:pointer; transition:color .15s, border-color .15s;
      }
      #rm-tabs button:hover  { color:var(--text-primary); }
      #rm-tabs button.active { color:var(--text-primary); border-bottom-color:var(--text-primary); }
      .pending-badge { background:var(--accent-amber); color:#000; border-radius:999px; font-size:10px; font-weight:700; padding:1px 6px; margin-left:4px; }
      .floor-label { font-size:var(--text-xs); font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--text-tertiary); margin:var(--space-5) 0 var(--space-3); }
      .legend-dot { width:8px; height:8px; border-radius:50%; display:inline-block; }
    </style>

    <div id="admin-rooms-page" class="page-enter">
      <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:var(--space-4); margin-bottom:var(--space-5);">
        <div>
          <h2>Room Management</h2>
          <p>Allocate rooms, manage students, handle requests.</p>
        </div>
        <div class="hostel-filter-bar">
          <label class="hostel-filter-label">Hostel</label>
          <select class="hostel-filter-select" id="rm-hostel-filter">
            <option value="">All</option>
            ${Oe.map(y=>`<option value="${y}" ${y===d?"selected":""}>${y}</option>`).join("")}
          </select>
        </div>
      </div>

      <div id="rm-tabs">
        <button data-tab="grid"    class="active">Room Grid</button>
        <button data-tab="student">Add Student</button>
        <button data-tab="pending">Pending${e>0?`<span class="pending-badge">${e}</span>`:""}</button>
        <button data-tab="history">All Requests</button>
      </div>

      <div id="rm-panel-grid"></div>
      <div id="rm-panel-student" style="display:none;"></div>
      <div id="rm-panel-pending" style="display:none;"></div>
      <div id="rm-panel-history" style="display:none;"></div>
    </div>
  `,document.getElementById("rm-hostel-filter").addEventListener("change",y=>{d=y.target.value,me(d),p()}),document.querySelectorAll("#rm-tabs button").forEach(y=>{y.addEventListener("click",()=>{c=y.dataset.tab,document.querySelectorAll("#rm-tabs button").forEach(x=>x.classList.toggle("active",x.dataset.tab===c)),["grid","student","pending","history"].forEach(x=>{document.getElementById(`rm-panel-${x}`).style.display=x===c?"":"none"}),p()})});function p(){c==="grid"&&s(),c==="student"&&b(),c==="pending"&&k(),c==="history"&&u()}function s(){const y=d?m.filter(g=>g.hostel===d):m,x={};y.forEach(g=>{(x[g.hostel]=x[g.hostel]||{})[g.floor]=(x[g.hostel][g.floor]||[]).concat(g)});const f=y.filter(g=>g.current_occupancy===0).length,C=y.filter(g=>g.current_occupancy>0&&g.current_occupancy<g.capacity).length,l=y.filter(g=>g.current_occupancy>=g.capacity).length,w=g=>{const E=g.capacity>0?g.current_occupancy/g.capacity:0;return`<div class="room-cell ${E===0?"vacant":E<1?"partial":"full"}" title="${g.room_id} — ${g.type} ${g.current_occupancy}/${g.capacity}">
        <div class="rc-id">${g.room_id}</div>
        <div style="font-size:9px;opacity:.5;">${g.current_occupancy}/${g.capacity}</div>
      </div>`};let v=`<div style="display:flex;gap:var(--space-5);margin-bottom:var(--space-5);">
      <span style="display:flex;align-items:center;gap:6px;font-size:var(--text-xs);color:var(--text-secondary);"><span class="legend-dot" style="background:var(--accent-green);"></span>Vacant (${f})</span>
      <span style="display:flex;align-items:center;gap:6px;font-size:var(--text-xs);color:var(--text-secondary);"><span class="legend-dot" style="background:var(--accent-amber);"></span>Partial (${C})</span>
      <span style="display:flex;align-items:center;gap:6px;font-size:var(--text-xs);color:var(--text-secondary);"><span class="legend-dot" style="background:var(--accent-red);"></span>Full (${l})</span>
    </div>`;for(const g of Object.keys(x).sort()){v+=`<div style="font-size:var(--text-sm);font-weight:600;margin:var(--space-6) 0 var(--space-3);padding-bottom:var(--space-2);border-bottom:1px solid var(--border-subtle);">${g}</div>`;for(const E of Object.keys(x[g]).sort((h,L)=>+h-+L)){const h=x[g][E].sort((M,F)=>M.room_id.localeCompare(F.room_id)),L=h.slice(0,5),S=h.slice(5,10);v+=`<div class="floor-label">Floor ${E}</div>
          <div class="floor-corridor">
            <div class="corridor-row">${L.map(w).join("")}</div>
            <div class="corridor-strip"><div class="corridor-strip-line"></div><div class="corridor-strip-label">corridor</div><div class="corridor-strip-line"></div></div>
            <div class="corridor-row">${S.map(w).join("")}</div>
          </div>`}}y.length||(v+='<p style="padding:var(--space-8);text-align:center;color:var(--text-tertiary);">No rooms.</p>'),document.getElementById("rm-panel-grid").innerHTML=v}function b(){const y=document.getElementById("rm-panel-student");y.innerHTML=`
      <div style="display:grid; grid-template-columns:minmax(0,1.2fr) minmax(0,1fr); gap:var(--space-8); align-items:start;">

        <!-- LEFT: Register form -->
        <div>
          <div style="font-size:var(--text-xs);font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-tertiary);margin-bottom:var(--space-5);">Register Student</div>
          <div id="add-msg"></div>
          <form id="add-form" autocomplete="off">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);">
              <div class="form-group">
                <label class="form-label">Roll No *</label>
                <input class="form-input" name="roll_no" placeholder="DL.AI.U4AID24200" required />
              </div>
              <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input class="form-input" name="name" placeholder="Priya Mehta" required />
              </div>
              <div class="form-group">
                <label class="form-label">Email *</label>
                <input class="form-input" type="email" name="email" placeholder="priya@ahcms.edu.in" required />
              </div>
              <div class="form-group">
                <label class="form-label">Gender *</label>
                <select class="form-select" name="gender" id="add-gender" required>
                  <option value="">Select</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Course *</label>
                <select class="form-select" name="course" id="add-course" required>
                  <option value="">Select</option>
                  <option value="MBBS">MBBS</option>
                  <option value="B.Tech">B.Tech</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Year *</label>
                <select class="form-select" name="year" id="add-year" required>
                  <option value="">Select course first</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Adm. Year *</label>
                <input class="form-input" type="number" name="adm_year" min="2015" max="2030" placeholder="2024" required />
              </div>
              <div class="form-group">
                <label class="form-label">Pass-out Year *</label>
                <input class="form-input" type="number" name="pass_year" min="2015" max="2035" placeholder="2029" required />
              </div>
              <div class="form-group" style="grid-column:span 2;">
                <label class="form-label">Home Address</label>
                <input class="form-input" name="address" placeholder="City, State" />
              </div>
            </div>

            <hr style="border-color:var(--border-subtle);margin:var(--space-5) 0;" />
            <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-4);">
              <input type="checkbox" id="also-alloc" style="width:15px;height:15px;" />
              <label for="also-alloc" style="font-size:var(--text-sm);cursor:pointer;font-weight:500;">Assign room immediately</label>
            </div>
            <div id="alloc-room-wrap" style="display:none;margin-bottom:var(--space-4);">
              <label class="form-label">Room</label>
              <select class="form-select" name="alloc_room" id="alloc-room-select">
                <option value="">— pick gender first —</option>
              </select>
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%;" id="add-btn">Register Student</button>
          </form>
        </div>

        <!-- RIGHT: Students list + quick allocate -->
        <div>
          <div style="font-size:var(--text-xs);font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-tertiary);margin-bottom:var(--space-5);">
            Students (${n.length})
          </div>
          <div id="quick-alloc-msg"></div>
          <div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-bottom:var(--space-3);">Unallocated · click  Assign to allocate a room</div>
          <div style="display:flex;flex-direction:column;gap:var(--space-3);" id="student-quick-list">
            ${n.map(f=>`
              <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3) var(--space-4);background:var(--bg-elevated);border-radius:var(--radius-md);border:1px solid var(--border-subtle);gap:var(--space-3);">
                <div>
                  <div style="font-size:var(--text-sm);font-weight:500;">${I(f.name)}</div>
                  <div style="font-size:var(--text-xs);color:var(--text-tertiary);">${f.roll_no} · ${f.gender==="M"?"Male":"Female"} · ${f.course} Yr ${f.year}</div>
                </div>
                <div style="display:flex;align-items:center;gap:var(--space-3);flex-shrink:0;">
                  ${f.alloc_room?`<span class="cell-mono" style="font-size:var(--text-xs);color:var(--accent-green);">${f.alloc_room}</span>`:`<select class="form-select" style="padding:4px 8px;font-size:var(--text-xs);min-width:130px;" data-stu="${f.student_id}" data-gender="${f.gender}" id="qs-room-${f.student_id}">
                        <option value="">— room —</option>
                        ${re(m,f.gender,f.course).map(se).join("")}
                      </select>
                      <button class="btn btn-sm btn-primary" data-assign="${f.student_id}" style="white-space:nowrap;">Assign</button>`}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `,document.getElementById("also-alloc").addEventListener("change",f=>{document.getElementById("alloc-room-wrap").style.display=f.target.checked?"":"none",x()}),document.getElementById("add-gender").addEventListener("change",x),document.getElementById("add-course").addEventListener("change",f=>{const C=f.target.value==="MBBS"?5:f.target.value==="B.Tech"?4:0,l=document.getElementById("add-year");l.innerHTML=C?'<option value="">Select</option>'+Array.from({length:C},(w,v)=>`<option value="${v+1}">Year ${v+1}</option>`).join(""):'<option value="">Select course first</option>',x()});function x(){const f=document.getElementById("add-gender").value,C=document.getElementById("add-course").value,l=re(m,f,C),w=document.getElementById("alloc-room-select"),v=U[`${f}-${C}`]?`Floor ${U[`${f}-${C}`].floor} rooms`:"rooms";w.innerHTML=l.length?`<option value="">— pick a room (${v}) —</option>${l.map(se).join("")}`:`<option value="">No vacant ${v}</option>`}y.querySelectorAll("[data-assign]").forEach(f=>{f.addEventListener("click",async()=>{const C=f.dataset.assign,l=document.getElementById(`qs-room-${C}`),w=l==null?void 0:l.value;if(!w){B("Select a room first.","error");return}f.disabled=!0,f.textContent="…";try{await $.post("/rooms/direct-allocate",{student_id:C,room_id:w}),B("Room assigned!","success"),await r()}catch(v){B(v.message,"error"),f.disabled=!1,f.textContent="Assign"}})}),document.getElementById("add-form").addEventListener("submit",async f=>{f.preventDefault();const C=new FormData(f.target),l=Object.fromEntries(C.entries());l.hostel=l.gender==="M"?"Senior MBBS boys hostel":l.gender==="F"?"Senior MBBS girls hostel":"";const w=document.getElementById("add-btn"),v=document.getElementById("add-msg");w.disabled=!0,w.textContent="Registering…",v.innerHTML="";try{const g=await $.post("/students",l);document.getElementById("also-alloc").checked&&l.alloc_room&&await $.post("/rooms/direct-allocate",{student_id:g.student_id,room_id:l.alloc_room}),v.innerHTML=`<div style="background:color-mix(in srgb,var(--accent-green) 10%,transparent);border:1px solid color-mix(in srgb,var(--accent-green) 25%,transparent);border-radius:8px;padding:var(--space-3) var(--space-4);font-size:var(--text-sm);color:var(--accent-green);margin-bottom:var(--space-4);">
          ✓ ${g.name} registered. ID: <strong>${g.student_id}</strong> · Login: <strong>${g.default_password}</strong>
        </div>`,f.target.reset(),document.getElementById("alloc-room-wrap").style.display="none",await r()}catch(g){v.innerHTML=`<div style="background:color-mix(in srgb,var(--accent-red) 10%,transparent);border:1px solid color-mix(in srgb,var(--accent-red) 25%,transparent);border-radius:8px;padding:var(--space-3) var(--space-4);font-size:var(--text-sm);color:var(--accent-red);margin-bottom:var(--space-4);">${g.message}</div>`,w.disabled=!1,w.textContent="Register Student"}})}function k(){const y=document.getElementById("rm-panel-pending"),x=i.filter(l=>l.status==="pending"),f=o.filter(l=>l.status==="pending");if(!x.length&&!f.length){y.innerHTML='<p style="padding:var(--space-10);text-align:center;color:var(--text-tertiary);">No pending requests. All clear.</p>';return}let C="";x.length&&(C+=`<div style="font-size:var(--text-xs);font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-tertiary);margin-bottom:var(--space-4);">Booking Requests (${x.length})</div>
      <div style="display:flex;flex-direction:column;gap:var(--space-3);margin-bottom:var(--space-8);">
        ${x.map(l=>{var w;return`
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-3);padding:var(--space-4) var(--space-5);background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:var(--radius-md);">
            <div>
              <div style="font-weight:500;font-size:var(--text-sm);">${I(l.student_name)} <span style="font-size:var(--text-xs);color:var(--text-tertiary);font-weight:400;">· ${l.roll_no}</span></div>
              <div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:2px;">Room <strong style="color:var(--text-secondary);">${l.room_id}</strong> · ${I(l.room_hostel||l.hostel)} · Floor ${l.floor} · ${l.type} · ${l.current_occupancy}/${l.capacity}</div>
              ${l.preferences?`<div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:2px;">Pref: ${I(l.preferences)}</div>`:""}
              <div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:2px;">${(w=l.created_at)==null?void 0:w.slice(0,10)}</div>
            </div>
            <div style="display:flex;gap:var(--space-2);">
              <button class="btn btn-sm btn-primary" data-breq="${l.request_id}" data-action="approved">Approve</button>
              <button class="btn btn-sm btn-secondary" style="color:var(--accent-red);" data-breq="${l.request_id}" data-action="rejected">Reject</button>
            </div>
          </div>`}).join("")}
      </div>`),f.length&&(C+=`<div style="font-size:var(--text-xs);font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-tertiary);margin-bottom:var(--space-4);">Room Change Requests (${f.length})</div>
      <div style="display:flex;flex-direction:column;gap:var(--space-3);">
        ${f.map(l=>{var w;return`
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-3);padding:var(--space-4) var(--space-5);background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:var(--radius-md);">
            <div>
              <div style="font-weight:500;font-size:var(--text-sm);">${I(l.student_name)} <span style="font-size:var(--text-xs);color:var(--text-tertiary);font-weight:400;">· ${l.roll_no}</span></div>
              <div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:2px;"><strong style="color:var(--text-secondary);">${l.from_room_id}</strong> → <strong style="color:var(--text-secondary);">${l.to_room_id}</strong> · ${I(l.to_hostel)} · Fl ${l.to_floor} · ${l.to_occupancy}/${l.to_capacity}</div>
              <div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:2px;">Reason: ${I(l.reason)}</div>
              <div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:2px;">${(w=l.created_at)==null?void 0:w.slice(0,10)}</div>
            </div>
            <div style="display:flex;gap:var(--space-2);">
              <button class="btn btn-sm btn-primary" data-creq="${l.change_id}" data-action="approved">Approve</button>
              <button class="btn btn-sm btn-secondary" style="color:var(--accent-red);" data-creq="${l.change_id}" data-action="rejected">Reject</button>
            </div>
          </div>`}).join("")}
      </div>`),y.innerHTML=C,y.querySelectorAll("[data-breq]").forEach(l=>{l.addEventListener("click",async()=>{l.disabled=!0;try{await $.patch(`/rooms/booking-requests/${l.dataset.breq}`,{status:l.dataset.action}),B(`Request ${l.dataset.action}.`,"success"),await r()}catch(w){B(w.message,"error"),l.disabled=!1}})}),y.querySelectorAll("[data-creq]").forEach(l=>{l.addEventListener("click",async()=>{l.disabled=!0;try{await $.patch(`/rooms/change-requests/${l.dataset.creq}`,{status:l.dataset.action}),B(`Room change ${l.dataset.action}.`,"success"),await r()}catch(w){B(w.message,"error"),l.disabled=!1}})})}function u(){const y=document.getElementById("rm-panel-history"),x=d?i.filter(l=>l.room_hostel===d||l.hostel===d):i,f=d?o.filter(l=>l.from_hostel===d||l.to_hostel===d):o,C=[...x.map(l=>({type:"booking",...l})),...f.map(l=>({type:"change",...l}))].sort((l,w)=>(w.created_at||"").localeCompare(l.created_at||""));if(!C.length){y.innerHTML='<p style="padding:var(--space-10);text-align:center;color:var(--text-tertiary);">No requests yet.</p>';return}y.innerHTML=`
      <div class="table-container">
        <table>
          <thead><tr><th>Type</th><th>Student</th><th>Details</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            ${C.map(l=>{var g;const w=l.type==="booking"?`Room ${l.room_id} · ${I(l.room_hostel||l.hostel)} · Fl ${l.floor}`:`${l.from_room_id} → ${l.to_room_id} · ${I(l.to_hostel)}`,v=l.status==="pending"?"open":l.status==="approved"?"in-progress":"resolved";return`<tr>
                <td style="font-size:var(--text-xs);color:var(--text-tertiary);">${l.type==="booking"?"Booking":"Transfer"}</td>
                <td><div style="font-weight:500;font-size:var(--text-sm);">${I(l.student_name)}</div><div style="font-size:var(--text-xs);color:var(--text-tertiary);">${l.roll_no}</div></td>
                <td style="font-size:var(--text-xs);">${w}</td>
                <td><span class="badge badge-${v}">${l.status}</span></td>
                <td class="cell-mono">${(g=l.created_at)==null?void 0:g.slice(0,10)}</td>
              </tr>`}).join("")}
          </tbody>
        </table>
      </div>`}s(),requestAnimationFrame(()=>{var y;return(y=document.getElementById("admin-rooms-page"))==null?void 0:y.classList.replace("page-enter","page-active")})}const ie=["Plumber","Electrician","WiFi","Authority","Other"],A=(t,a="")=>`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;opacity:.65;" ${a}>${t}</svg>`,Ue={Plumber:A('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),Electrician:A('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'),WiFi:A('<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>'),Authority:A('<line x1="3" y1="22" x2="21" y2="22"/><rect x="2" y="11" width="20" height="11" rx="1"/><polygon points="12 2 2 7 22 7"/><line x1="12" y1="7" x2="12" y2="11"/><rect x="9" y="15" width="6" height="7" rx="1"/>'),Other:A('<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>')},We=A('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>'),Ye=A('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>');async function Je(t){t.innerHTML='<div class="page-loading">Loading…</div>';try{const a=await $.get("/resources");Ke(t,a)}catch(a){t.innerHTML=`<div class="page-error">Failed to load: ${a.message}</div>`}}function Ke(t,a){let r=a,m="",i=null;t.innerHTML=`
    <div class="page-enter" id="resources-page">
      <div class="page-header">
        <h2>Resources &amp; Contacts</h2>
        <p>Manage the contact directory for maintenance staff and authorities.</p>
      </div>

      <!-- Add / Edit Form -->
      <div class="form-section" style="max-width: none; margin-bottom: var(--space-8);">
        <div class="form-section-title" id="resource-form-title">Add New Contact</div>
        <form id="resource-form" novalidate>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label" for="res-cat">Category</label>
              <select class="form-select" id="res-cat" required>
                <option value="">Select…</option>
                ${ie.map(c=>`<option value="${c}">${c}</option>`).join("")}
              </select>
              <div class="form-error" id="err-res-cat">Required</div>
            </div>
            <div class="form-group">
              <label class="form-label" for="res-name">Name / Organisation</label>
              <input type="text" class="form-input" id="res-name" placeholder="e.g. Vijay Electricals" required />
              <div class="form-error" id="err-res-name">Required</div>
            </div>
            <div class="form-group">
              <label class="form-label" for="res-phone">Phone</label>
              <input type="tel" class="form-input" id="res-phone" placeholder="10-digit number" />
            </div>
            <div class="form-group">
              <label class="form-label" for="res-email">Email</label>
              <input type="email" class="form-input" id="res-email" placeholder="contact@example.com" />
            </div>
            <div class="form-group full-width">
              <label class="form-label" for="res-notes">Notes</label>
              <textarea class="form-textarea" id="res-notes" rows="2" placeholder="Availability, instructions, etc."></textarea>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" id="btn-res-submit">Add Contact</button>
            <button type="button" class="btn btn-secondary" id="btn-res-cancel" style="display:none;">Cancel Edit</button>
          </div>
        </form>
      </div>

      <!-- Filter + Directory -->
      <div class="table-container">
        <div class="table-toolbar">
          <div class="table-toolbar-title">Contact Directory</div>
          <div style="display:flex; gap:var(--space-2); flex-wrap:wrap;">
            <select class="form-select" id="cat-filter-select" style="width:auto; padding:6px 28px 6px 12px; font-size:var(--text-sm);">
              <option value="">All Categories</option>
              ${ie.map(c=>`<option value="${c}">${c}</option>`).join("")}
            </select>
          </div>
        </div>
        <div id="resources-body"></div>
      </div>
    </div>
  `;function o(){const c=m?r.filter(p=>p.category===m):r,d=document.getElementById("resources-body");if(c.length===0){d.innerHTML='<p style="padding:var(--space-8); text-align:center; color:var(--text-tertiary);">No contacts in this category.</p>';return}const e={};c.forEach(p=>{e[p.category]||(e[p.category]=[]),e[p.category].push(p)}),d.innerHTML=Object.entries(e).map(([p,s])=>`
      <div style="padding: var(--space-4) var(--space-6);">
        <div style="display:flex; align-items:center; gap:6px; font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--text-tertiary); margin-bottom: var(--space-3);">
          ${Ue[p]||""} ${p}
        </div>
        ${s.map(b=>`
          <div class="contact-row" style="margin-bottom: var(--space-2);">
            <div class="contact-avatar">${b.name[0].toUpperCase()}</div>
            <div class="contact-info" style="flex:1;">
              <div class="contact-name">${b.name}</div>
              <div class="contact-meta" style="display:flex; flex-wrap:wrap; align-items:center; gap:var(--space-4);">
                ${b.phone?`<span style="display:inline-flex;align-items:center;gap:4px;">${We}<a href="tel:${b.phone}" style="color:inherit;">${b.phone}</a></span>`:""}
                ${b.email?`<span style="display:inline-flex;align-items:center;gap:4px;">${Ye}<a href="mailto:${b.email}" style="color:inherit;">${b.email}</a></span>`:""}
              </div>
              ${b.notes?`<div style="font-size:var(--text-xs); color:var(--text-tertiary); margin-top:2px;">${b.notes}</div>`:""}
            </div>
            <div style="display:flex; gap:4px; flex-shrink:0;">
              <button class="btn btn-sm btn-secondary" data-edit="${b.resource_id}">Edit</button>
              <button class="btn btn-sm btn-secondary" data-delete="${b.resource_id}" style="color:var(--accent-red);">Del</button>
            </div>
          </div>
        `).join("")}
        <hr style="border:none; border-top: 1px solid var(--border-subtle); margin: var(--space-3) 0;" />
      </div>
    `).join(""),d.querySelectorAll("[data-edit]").forEach(p=>{p.addEventListener("click",()=>{const s=r.find(b=>b.resource_id===+p.dataset.edit);s&&(i=s.resource_id,document.getElementById("res-cat").value=s.category,document.getElementById("res-name").value=s.name,document.getElementById("res-phone").value=s.phone||"",document.getElementById("res-email").value=s.email||"",document.getElementById("res-notes").value=s.notes||"",document.getElementById("resource-form-title").textContent="Edit Contact",document.getElementById("btn-res-submit").textContent="Save Changes",document.getElementById("btn-res-cancel").style.display="",document.getElementById("resource-form").scrollIntoView({behavior:"smooth"}))})}),d.querySelectorAll("[data-delete]").forEach(p=>{p.addEventListener("click",async()=>{if(confirm("Delete this contact?")){p.disabled=!0;try{await $.delete(`/resources/${p.dataset.delete}`),r=r.filter(s=>s.resource_id!==+p.dataset.delete),B("Contact deleted.","success"),o()}catch(s){B(s.message,"error"),p.disabled=!1}}})})}document.getElementById("cat-filter-select").addEventListener("change",c=>{m=c.target.value,o()}),document.getElementById("btn-res-cancel").addEventListener("click",()=>{i=null,document.getElementById("resource-form").reset(),document.getElementById("resource-form-title").textContent="Add New Contact",document.getElementById("btn-res-submit").textContent="Add Contact",document.getElementById("btn-res-cancel").style.display="none"});const n=document.getElementById("resource-form");n.addEventListener("submit",async c=>{c.preventDefault(),t.querySelectorAll(".form-error").forEach(k=>k.classList.remove("visible"));let d=!0;const e=document.getElementById("res-cat").value,p=document.getElementById("res-name").value.trim();if(e||(document.getElementById("err-res-cat").classList.add("visible"),d=!1),p||(document.getElementById("err-res-name").classList.add("visible"),d=!1),!d)return;const s={category:e,name:p,phone:document.getElementById("res-phone").value.trim()||null,email:document.getElementById("res-email").value.trim()||null,notes:document.getElementById("res-notes").value.trim()||null},b=document.getElementById("btn-res-submit");b.disabled=!0;try{if(i){const k=await $.put(`/resources/${i}`,s);r=r.map(u=>u.resource_id===i?k:u),B("Contact updated.","success"),document.getElementById("btn-res-cancel").click()}else r=[await $.post("/resources",s),...r],B("Contact added.","success"),n.reset();o()}catch(k){B(k.message,"error")}finally{b.disabled=!1}}),o(),requestAnimationFrame(()=>{var c;return(c=document.getElementById("resources-page"))==null?void 0:c.classList.replace("page-enter","page-active")})}const Qe={home:we,complaints:Ce,booking:G,forum:pe,resources:qe},Xe={home:Pe,complaints:De,rooms:Ge,forum:pe,resources:Je};let z="home",W=null;function Y(){return K()==="admin"?Xe:Qe}function D(t){const a=Y();a[t]||(t="home"),z=t,window.location.hash=t;const r=document.getElementById("sidebar"),m=document.getElementById("main-content");fe(r,z,D),a[t](m,()=>D(z)),W&&W.close()}function ne(){document.body.innerHTML=`
    <div id="app">
      <aside id="sidebar" class="sidebar"></aside>
      <main id="main-content" class="main"></main>
    </div>
  `}function Ze(){if(!ue()){$e(()=>{ne(),le()});return}ne(),le()}function le(){W=be();const t=window.location.hash.replace("#","");z=Y()[t]?t:"home",D(z),window.addEventListener("hashchange",()=>{const r=window.location.hash.replace("#","");Y()[r]&&r!==z&&D(r)})}(function(){const t=localStorage.getItem("ahcms_theme")||"light";document.documentElement.setAttribute("data-theme",t)})();Ze();
