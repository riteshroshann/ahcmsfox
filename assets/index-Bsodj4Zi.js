(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))c(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&c(l)}).observe(document,{childList:!0,subtree:!0});function r(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function c(s){if(s.ep)return;s.ep=!0;const o=r(s);fetch(s.href,o)}})();const F="ahcms_token",O="ahcms_user";(function(){const a=localStorage.getItem("cw_hostel_token"),r=localStorage.getItem("cw_hostel_user");a&&(localStorage.setItem(F,a),localStorage.removeItem("cw_hostel_token")),r&&(localStorage.setItem(O,r),localStorage.removeItem("cw_hostel_user"))})();function Q(t,a){localStorage.setItem(F,t),localStorage.setItem(O,JSON.stringify(a))}function ie(){return localStorage.getItem(F)}function Y(){try{return JSON.parse(localStorage.getItem(O))}catch{return null}}function ne(){var t;return((t=Y())==null?void 0:t.role)||null}function pe(){const t=ie();if(!t)return!1;try{return JSON.parse(atob(t.split(".")[1])).exp*1e3>Date.now()}catch{return!1}}function le(){localStorage.removeItem(F),localStorage.removeItem(O)}const _={home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',complaints:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="15" r="0.5" fill="currentColor"/></svg>',booking:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',rooms:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',resources:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',logout:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',theme:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'},me=[{id:"home",label:"Home",icon:_.home},{id:"complaints",label:"Complaint",icon:_.complaints},{id:"booking",label:"Room Booking",icon:_.booking},{id:"resources",label:"Resources",icon:_.resources}],ve=[{id:"home",label:"Home",icon:_.home},{id:"complaints",label:"Complaints",icon:_.complaints},{id:"rooms",label:"Room Details",icon:_.rooms},{id:"resources",label:"Resources",icon:_.resources}];function ge(t,a,r){var d,v;const c=ne(),s=Y(),o=c==="admin"?ve:me,l=c==="admin"?"Admin Panel":"Student Portal";t.innerHTML=`
    <div class="sidebar-brand">
      <h1>AHCMS</h1>
      <span>${l}</span>
    </div>

    <div class="sidebar-user">
      <div class="sidebar-user-avatar">${((s==null?void 0:s.name)||"U")[0].toUpperCase()}</div>
      <div class="sidebar-user-info">
        <div class="sidebar-user-name">${(s==null?void 0:s.name)||"User"}</div>
        <div class="sidebar-user-role">${c==="admin"?"Administrator":(s==null?void 0:s.roll_no)||"Student"}</div>
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
  `,t.querySelectorAll(".nav-item[data-page]").forEach(e=>{e.addEventListener("click",()=>r(e.dataset.page)),e.addEventListener("keydown",m=>{(m.key==="Enter"||m.key===" ")&&(m.preventDefault(),e.click())})}),(d=document.getElementById("nav-logout"))==null||d.addEventListener("click",()=>{le(),window.location.reload()}),(v=document.getElementById("nav-theme"))==null||v.addEventListener("click",()=>{const m=(document.documentElement.getAttribute("data-theme")||"light")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",m),localStorage.setItem("ahcms_theme",m)})}function ue(){const t=document.createElement("button");t.className="sidebar-toggle",t.id="sidebar-toggle",t.innerHTML=_.menu,t.setAttribute("aria-label","Toggle navigation");const a=document.createElement("div");a.className="sidebar-overlay",a.id="sidebar-overlay",document.body.appendChild(t),document.body.appendChild(a);const r=document.getElementById("sidebar");function c(){r.classList.add("open"),a.classList.add("show"),t.innerHTML=_.close}function s(){r.classList.remove("open"),a.classList.remove("show"),t.innerHTML=_.menu}return t.addEventListener("click",()=>r.classList.contains("open")?s():c()),a.addEventListener("click",s),{close:s}}const ye="/api";async function R(t,a,r){const c=ie(),s={"Content-Type":"application/json"};c&&(s.Authorization=`Bearer ${c}`);const o=new AbortController,l=setTimeout(()=>o.abort(),1e4);try{const d=await fetch(`${ye}${a}`,{method:t,headers:s,body:r!==void 0?JSON.stringify(r):void 0,signal:o.signal});if(d.status===401){le(),window.location.reload();return}const v=await d.json().catch(()=>({}));if(!d.ok)throw new Error(v.error||`Request failed (${d.status})`);return v}catch(d){throw d.name==="AbortError"?new Error("Request timed out — is the server running?"):d}finally{clearTimeout(l)}}const E={get:t=>R("GET",t),post:(t,a)=>R("POST",t,a),patch:(t,a)=>R("PATCH",t,a),put:(t,a)=>R("PUT",t,a),delete:t=>R("DELETE",t)};let H=null;function fe(){H||(H=document.createElement("div"),H.className="toast-container",document.body.appendChild(H))}function B(t,a="info",r=3500){fe();const c=document.createElement("div");c.className=`toast toast-${a}`,c.textContent=t,H.appendChild(c),requestAnimationFrame(()=>{requestAnimationFrame(()=>{c.classList.add("show")})}),setTimeout(()=>{c.classList.remove("show"),setTimeout(()=>c.remove(),300)},r)}function be(t){var c;document.body.innerHTML=`
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
  `,(c=document.getElementById("login-theme"))==null||c.addEventListener("click",()=>{const o=(document.documentElement.getAttribute("data-theme")||"light")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",o),localStorage.setItem("ahcms_theme",o)});let a="student";document.querySelectorAll(".login-tab").forEach(s=>{s.addEventListener("click",()=>{a=s.dataset.tab,document.querySelectorAll(".login-tab").forEach(o=>o.classList.remove("active")),s.classList.add("active"),document.getElementById("form-student").classList.toggle("hidden",a!=="student"),document.getElementById("form-admin").classList.toggle("hidden",a!=="admin"),document.getElementById("form-register").classList.add("hidden")})}),document.getElementById("btn-show-register").addEventListener("click",()=>{document.getElementById("form-admin").classList.add("hidden"),document.getElementById("form-register").classList.remove("hidden")}),document.getElementById("btn-back-login").addEventListener("click",()=>{document.getElementById("form-register").classList.add("hidden"),document.getElementById("form-admin").classList.remove("hidden")});function r(s,o){const l=document.getElementById(s);l.disabled=o,l.textContent=o?"Signing in…":"Sign In"}document.getElementById("form-student").addEventListener("submit",async s=>{s.preventDefault();const o=document.getElementById("s-roll").value.trim(),l=document.getElementById("s-pass").value,d=document.getElementById("err-student");if(d.textContent="",!o||!l){d.textContent="All fields required.";return}r("btn-student-login",!0);try{const{token:v,user:e}=await E.post("/auth/student/login",{roll_no:o,password:l});Q(v,e),t()}catch(v){d.textContent=v.message}finally{r("btn-student-login",!1)}}),document.getElementById("form-admin").addEventListener("submit",async s=>{s.preventDefault();const o=document.getElementById("a-email").value.trim(),l=document.getElementById("a-pass").value,d=document.getElementById("err-admin");if(d.textContent="",!o||!l){d.textContent="All fields required.";return}r("btn-admin-login",!0);try{const{token:v,user:e}=await E.post("/auth/admin/login",{email:o,password:l});Q(v,e),t()}catch(v){d.textContent=v.message}finally{r("btn-admin-login",!1)}}),document.getElementById("form-register").addEventListener("submit",async s=>{s.preventDefault();const o=document.getElementById("r-name").value.trim(),l=document.getElementById("r-email").value.trim(),d=document.getElementById("r-pass").value,v=document.getElementById("err-register");if(v.textContent="",!o||!l||!d){v.textContent="All fields required.";return}if(d.length<8){v.textContent="Password must be at least 8 characters.";return}const e=document.getElementById("btn-register");e.disabled=!0,e.textContent="Creating…";try{await E.post("/auth/admin/register",{name:o,email:l,password:d}),B("Account created! Please sign in.","success"),document.getElementById("btn-back-login").click(),document.getElementById("a-email").value=l}catch(m){v.textContent=m.message}finally{e.disabled=!1,e.textContent="Create Account"}})}async function he(t){t.innerHTML='<div class="page-loading">Loading…</div>';try{const{student:a,allocation:r,complaints:c,wardens:s,wardenOfficePhone:o}=await E.get("/dashboard/student");xe(t,a,r,c,s,o)}catch(a){t.innerHTML=`<div class="page-error">Failed to load dashboard: ${a.message}</div>`}}function xe(t,a,r,c,s,o){var v;const l=s.filter(e=>e.role==="Warden"),d=s.filter(e=>e.role==="Guard");t.innerHTML=`
    <div class="page-enter" id="student-home">
      <div class="page-header">
        <h2>Welcome, ${((v=a==null?void 0:a.name)==null?void 0:v.split(" ")[0])||"Student"}</h2>
        <p>${(a==null?void 0:a.course)||""} · ${(a==null?void 0:a.hostel)||""} · Year ${(a==null?void 0:a.year)||""}</p>
      </div>

      <!-- Student Info Card -->
      <div class="form-section" style="max-width: none; margin-bottom: var(--space-10);">
        <div class="form-section-title">Your Profile</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--space-4);">
          ${[["Roll No",a==null?void 0:a.roll_no],["Course",a==null?void 0:a.course],["Admission",a==null?void 0:a.adm_year],["Passing Year",a==null?void 0:a.pass_year],["Gender",(a==null?void 0:a.gender)==="M"?"Male":(a==null?void 0:a.gender)==="F"?"Female":a==null?void 0:a.gender],["Address",(a==null?void 0:a.address)||"—"]].map(([e,m])=>`
            <div>
              <div style="font-size: var(--text-xs); color: var(--text-tertiary); text-transform: uppercase; letter-spacing: .06em;">${e}</div>
              <div style="font-size: var(--text-sm); color: var(--text-primary); margin-top: 4px;">${m||"—"}</div>
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
          <div class="card-value">${c.filter(e=>e.status==="open").length}</div>
          <div class="card-sub">${c.filter(e=>e.status==="in-progress").length} in progress</div>
        </div>

        <div class="card card-accent-green">
          <div class="card-label">Resolved</div>
          <div class="card-value">${c.filter(e=>e.status==="resolved").length}</div>
          <div class="card-sub">of ${c.length} total</div>
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
          ${l.length===0?'<p class="empty-msg">No warden data available.</p>':l.map(e=>`
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
          ${d.length===0?'<p class="empty-msg">No guard data.</p>':d.map(e=>`
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
          ${c.length===0?'<p class="empty-msg">No complaints filed yet.</p>':`<div class="activity-list">
                ${c.slice(0,5).map(e=>`
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
  `,t.querySelectorAll('a.link-accent[href^="#"]').forEach(e=>{e.addEventListener("click",m=>{m.preventDefault(),window.location.hash=e.getAttribute("href").slice(1)})}),requestAnimationFrame(()=>{var e;return(e=document.getElementById("student-home"))==null?void 0:e.classList.replace("page-enter","page-active")})}const X=["Plumbing","Electricity","WiFi","Cleanliness","Carpentry","Other"],T=t=>`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;opacity:.6;vertical-align:middle;">${t}</svg>`,$e={Plumbing:T('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),Electricity:T('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'),WiFi:T('<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>'),Cleanliness:T('<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'),Carpentry:T('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),Other:T('<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>')},we=["open","in-progress","resolved"];async function Ee(t){t.innerHTML='<div class="page-loading">Loading…</div>';let a=[];try{a=await E.get("/complaints")}catch(r){t.innerHTML=`<div class="page-error">Failed to load: ${r.message}</div>`;return}ke(t,a)}function ke(t,a){let r=a,c="all",s="";t.innerHTML=`
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
                ${X.map(e=>`<option value="${e}">${e}</option>`).join("")}
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
          ${X.map(e=>`<option value="${e}">${e}</option>`).join("")}
        </select>
      </div>

      <!-- My Complaints Table -->
      <div class="table-container">
        <div class="table-toolbar">
          <div class="table-toolbar-title">My Complaints</div>
          <div style="display:flex; gap: var(--space-2); flex-wrap: wrap;">
            <button class="filter-chip active" data-status="all">All</button>
            ${we.map(e=>`<button class="filter-chip" data-status="${e}">${e}</button>`).join("")}
          </div>
        </div>
        <div id="complaints-list"></div>
      </div>
    </div>
  `;function o(){let e=r;s&&(e=e.filter(n=>n.category===s)),c!=="all"&&(e=e.filter(n=>n.status===c));const m=document.getElementById("complaints-list");if(e.length===0){m.innerHTML='<p style="padding: var(--space-8); text-align:center; color: var(--text-tertiary);">No complaints found.</p>';return}m.innerHTML=`
      <table>
        <thead>
          <tr>
            <th>#</th><th>Category</th><th>Description</th><th>Date</th><th>Status</th><th>Note</th>
          </tr>
        </thead>
        <tbody>
          ${e.map(n=>`
            <tr>
              <td class="cell-mono">${n.complaint_id}</td>
              <td><span style="display:inline-flex;align-items:center;gap:5px;">${$e[n.category]||""} ${n.category}</span></td>
              <td style="max-width:220px; overflow:hidden; text-overflow:ellipsis;" title="${n.description}">${n.description.slice(0,50)}${n.description.length>50?"…":""}</td>
              <td class="cell-mono">${n.date}</td>
              <td><span class="badge badge-${n.status}">${n.status}</span></td>
              <td style="color: var(--text-tertiary); font-size: var(--text-xs);">${n.admin_note||"—"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `}document.getElementById("cat-filter-select").addEventListener("change",e=>{s=e.target.value,o()}),t.querySelectorAll("[data-status]").forEach(e=>{e.addEventListener("click",()=>{t.querySelectorAll("[data-status]").forEach(m=>m.classList.remove("active")),e.classList.add("active"),c=e.dataset.status,o()})});const l=document.getElementById("cmp-category"),d=document.getElementById("cmp-other-group");l.addEventListener("change",e=>{e.target.value==="Other"?d.style.display="":(d.style.display="none",document.getElementById("cmp-other-type").value="",document.getElementById("err-cmp-other").classList.remove("visible"))});const v=document.getElementById("complaint-form");v.addEventListener("submit",async e=>{e.preventDefault();let m=!0;t.querySelectorAll(".form-error").forEach(x=>x.classList.remove("visible"));const n=document.getElementById("cmp-category").value,h=document.getElementById("cmp-other-type").value.trim(),S=document.getElementById("cmp-desc").value.trim(),g=document.getElementById("cmp-photo").files[0];if(n||(document.getElementById("err-cmp-cat").classList.add("visible"),m=!1),n==="Other"&&!h&&(document.getElementById("err-cmp-other").classList.add("visible"),m=!1),S||(document.getElementById("err-cmp-desc").classList.add("visible"),m=!1),!m){B("Fill in all required fields.","error");return}const y=document.getElementById("cmp-submit");y.disabled=!0,y.textContent="Submitting…";try{let x=null;g&&(x=await new Promise((i,$)=>{const p=new FileReader;p.onload=()=>i(p.result),p.onerror=$,p.readAsDataURL(g)}));const f=n==="Other"&&h?`[Other: ${h}] ${S}`:S,k=await E.post("/complaints",{category:n,description:f,photo_base64:x});r=[k,...r],B(`Complaint #${k.complaint_id} submitted.`,"success"),v.reset(),o()}catch(x){B(x.message,"error")}finally{y.disabled=!1,y.textContent="Submit Complaint"}}),v.addEventListener("reset",()=>{t.querySelectorAll(".form-error").forEach(e=>e.classList.remove("visible")),document.getElementById("cmp-other-group").style.display="none"}),o(),requestAnimationFrame(()=>{var e;return(e=document.getElementById("complaints-page"))==null?void 0:e.classList.replace("page-enter","page-active")})}async function N(t){t.innerHTML='<div class="page-loading">Loading rooms…</div>';try{const[a,{allocation:r},c,s]=await Promise.all([E.get("/rooms"),E.get("/rooms/my-allocation"),E.get("/rooms/booking-requests"),E.get("/rooms/change-requests")]);Ce(t,a,r,c,s)}catch(a){t.innerHTML=`<div class="page-error">Failed to load: ${a.message}</div>`}}function Ce(t,a,r,c,s){var g,y,x,f,k,i,$;const o=Y(),l=a.filter(p=>p.hostel===((o==null?void 0:o.hostel)||"")),d=[...new Set(l.map(p=>p.floor))].sort((p,u)=>p-u);let v=d[0]||1,e=null;const m=c.find(p=>p.status==="pending"),n=s.find(p=>p.status==="pending");if(t.innerHTML=`
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
              ${n?'<div style="font-size:var(--text-xs); color:var(--accent-amber); margin-top:var(--space-2);">Room change pending review</div>':'<button class="btn btn-secondary" id="btn-show-change" style="margin-top:var(--space-2);">Request Room Change</button>'}
            </div>
          </div>

          <!-- Room change request form (hidden until button click) -->
                <div id="change-req-section" class="change-req-form" style="display:${n?"block":"none"}">
            ${n?`
              <div style="font-size:var(--text-sm); font-weight:600; color:var(--accent-amber); margin-bottom:var(--space-3);">Pending Room Change Request</div>
              <div style="font-size:var(--text-sm); color:var(--text-secondary);">
                You have requested to move to <strong>${n.to_room_id}</strong> (${n.to_hostel}, Floor ${n.to_floor}).
                Submitted on ${(g=n.created_at)==null?void 0:g.slice(0,10)}. Awaiting warden approval.
              </div>
            `:(()=>{const p=a.filter(b=>b.hostel===r.hostel&&b.floor===r.floor&&b.room_id!==r.room_id&&b.current_occupancy<b.capacity).sort((b,L)=>b.room_id.localeCompare(L.room_id)),u=p.length===0,w=u?a.filter(b=>b.hostel===r.hostel&&b.room_id!==r.room_id&&b.current_occupancy<b.capacity).sort((b,L)=>b.floor-L.floor||b.room_id.localeCompare(L.room_id)):p;return`
              <div style="font-size:var(--text-sm); font-weight:600; margin-bottom:var(--space-4);">Request a Room Change</div>
              ${u?`
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
                    ${w.map(b=>`<option value="${b.room_id}">${b.room_id} · Fl ${b.floor} · ${b.type} · ${b.current_occupancy}/${b.capacity}</option>`).join("")}
                  </select>
                  ${w.length===0?'<div style="font-size:var(--text-xs); color:var(--accent-red); margin-top:4px;">No available rooms in your hostel.</div>':""}
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
      `:m?`
        <!-- ② No allocation but pending booking -->
        <div style="background:var(--bg-elevated); border:1px solid color-mix(in srgb,var(--accent-amber) 30%,transparent); border-radius:var(--radius-lg); padding:var(--space-6); margin-bottom:var(--space-6);">
          <div style="font-size:var(--text-xs); font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--text-tertiary); margin-bottom:var(--space-2);">Pending Booking Request</div>
          <div style="font-size:var(--text-2xl); font-weight:700; color:var(--accent-amber);">${m.room_id}</div>
          <div style="font-size:var(--text-sm); color:var(--text-secondary); margin-top:4px;">Submitted ${(y=m.created_at)==null?void 0:y.slice(0,10)} · Waiting for warden approval</div>
        </div>
      `:""}

      <!-- ③ Floor Plan (only shown if not yet allocated) -->
      ${r?"":`
        <div style="display:flex; align-items:center; gap:var(--space-4); margin-bottom:var(--space-5);">
          <span style="font-size:var(--text-sm); color:var(--text-secondary); font-weight:500;">Floor:</span>
          <div class="cat-tabs" style="margin:0;">
            ${d.map(p=>`
              <button class="cat-tab${p===v?" active":""}" data-floor="${p}">Floor ${p}</button>
            `).join("")}
          </div>
        </div>

        <div class="form-section" style="max-width:none; margin-bottom:var(--space-6);" id="floor-plan-section">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-4);">
            <div class="form-section-title" id="floor-plan-title" style="margin-bottom:0;">Floor ${v} — ${(o==null?void 0:o.hostel)||""}</div>
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
        ${c.length===0?'<p style="padding:var(--space-6); text-align:center; color:var(--text-tertiary);">No booking requests yet.</p>':`<table>
              <thead><tr><th>Room</th><th>Hostel</th><th>Floor</th><th>Type</th><th>Status</th><th>Note</th><th>Date</th></tr></thead>
              <tbody>
                ${c.map(p=>{var u;return`
                    <tr>
                      <td class="cell-mono">${p.room_id}</td>
                      <td style="font-size:var(--text-xs);">${p.hostel}</td>
                      <td>${p.floor}</td>
                      <td>${p.type}</td>
                      <td><span class="badge badge-${p.status==="pending"?"open":p.status==="approved"?"in-progress":"resolved"}">${p.status}</span></td>
                      <td style="color:var(--text-tertiary); font-size:var(--text-xs);">${p.admin_note||"—"}</td>
                      <td class="cell-mono">${(u=p.created_at)==null?void 0:u.slice(0,10)}</td>
                    </tr>
                `}).join("")}
              </tbody>
            </table>`}
      </div>

      ${s.length>0?`
      <div class="table-container">
        <div class="table-toolbar"><div class="table-toolbar-title">My Room Change Requests</div></div>
        <table>
          <thead><tr><th>From</th><th>To</th><th>To Hostel</th><th>Reason</th><th>Status</th><th>Note</th><th>Date</th></tr></thead>
          <tbody>
            ${s.map(p=>{var u;return`
              <tr>
                <td class="cell-mono">${p.from_room_id}</td>
                <td class="cell-mono">${p.to_room_id}</td>
                <td style="font-size:var(--text-xs);">${p.to_hostel}</td>
                <td style="max-width:160px; font-size:var(--text-xs);" title="${p.reason}">${p.reason.slice(0,50)}${p.reason.length>50?"…":""}</td>
                <td><span class="badge badge-${p.status==="pending"?"open":p.status==="approved"?"in-progress":"resolved"}">${p.status}</span></td>
                <td style="color:var(--text-tertiary); font-size:var(--text-xs);">${p.admin_note||"—"}</td>
                <td class="cell-mono">${(u=p.created_at)==null?void 0:u.slice(0,10)}</td>
              </tr>
            `}).join("")}
          </tbody>
        </table>
      </div>
      `:""}
    </div>
  `,!r){let p=function(w){const b=l.filter(C=>C.floor===w);document.getElementById("floor-plan-title").textContent=`Floor ${w} — ${(o==null?void 0:o.hostel)||""}`;const L=document.getElementById("floor-plan");if(!b.length){L.innerHTML='<p style="color:var(--text-tertiary); padding:var(--space-4);">No rooms on this floor.</p>';return}L.innerHTML=b.sort((C,I)=>C.room_id.localeCompare(I.room_id)).map(C=>{const I=C.capacity>0?C.current_occupancy/C.capacity:0,P=I===0?"vacant":I<1?"partial":"full",ce=(e==null?void 0:e.room_id)===C.room_id;return`
            <button class="room-cell ${P}${ce?" selected":""}"
                    data-room="${C.room_id}"
                    ${P==="full"?"disabled":""}
                    title="${C.room_id} · ${C.type} · ${C.current_occupancy}/${C.capacity}">
              <span class="room-cell-id">${C.room_id}</span>
              <span class="room-cell-type">${C.type[0]}</span>
              <span class="room-cell-occ">${C.current_occupancy}/${C.capacity}</span>
            </button>`}).join(""),L.querySelectorAll(".room-cell:not([disabled])").forEach(C=>{C.addEventListener("click",()=>{e=l.find(I=>I.room_id===C.dataset.room),p(w),u(e)})})},u=function(w){const b=document.getElementById("room-detail-panel");document.getElementById("room-detail-title").textContent=`Room ${w.room_id}`,document.getElementById("room-detail-body").innerHTML=`
        <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(130px,1fr)); gap:var(--space-4);">
          ${[["Hostel",w.hostel],["Floor",w.floor],["Type",w.type],["Capacity",`${w.capacity} beds`],["Occupied",`${w.current_occupancy}/${w.capacity}`],["Available",`${w.available_slots} slot(s)`]].map(([L,C])=>`<div>
              <div style="font-size:var(--text-xs); color:var(--text-tertiary); text-transform:uppercase; letter-spacing:.06em;">${L}</div>
              <div style="font-size:var(--text-sm); margin-top:4px;">${C}</div>
            </div>`).join("")}
        </div>
      `,b.style.display=m?"none":"block"};var h=p,S=u;t.querySelectorAll(".cat-tab[data-floor]").forEach(w=>{w.addEventListener("click",()=>{t.querySelectorAll(".cat-tab[data-floor]").forEach(b=>b.classList.remove("active")),w.classList.add("active"),v=+w.dataset.floor,e=null,document.getElementById("room-detail-panel").style.display="none",p(v)})}),(x=document.getElementById("btn-cancel-room"))==null||x.addEventListener("click",()=>{e=null,document.getElementById("room-detail-panel").style.display="none",p(v)}),(f=document.getElementById("booking-form"))==null||f.addEventListener("submit",async w=>{if(w.preventDefault(),!e)return;const b=document.getElementById("btn-book");b.disabled=!0,b.textContent="Submitting…";try{await E.post("/rooms/book",{room_id:e.room_id,preferences:document.getElementById("booking-pref").value.trim()}),B(`Booking request for ${e.room_id} submitted!`,"success"),N(t)}catch(L){B(L.message,"error"),b.disabled=!1,b.textContent="Request This Room"}}),p(v)}r&&!n&&((k=document.getElementById("btn-show-change"))==null||k.addEventListener("click",()=>{document.getElementById("change-req-section").style.display="block",document.getElementById("btn-show-change").style.display="none"}),(i=document.getElementById("btn-cancel-change"))==null||i.addEventListener("click",()=>{document.getElementById("change-req-section").style.display="none",document.getElementById("btn-show-change").style.display=""}),($=document.getElementById("change-req-form"))==null||$.addEventListener("submit",async p=>{p.preventDefault();const u=new FormData(p.target),w=document.getElementById("btn-submit-change"),b=document.getElementById("change-msg");w.disabled=!0,w.textContent="Submitting…",b.innerHTML="";try{await E.post("/rooms/change-requests",Object.fromEntries(u.entries())),B("Room change request submitted. Awaiting warden approval.","success"),N(t)}catch(L){b.innerHTML=`<div style="color:var(--accent-red); font-size:var(--text-sm); margin-bottom:var(--space-3); padding:var(--space-3); background:color-mix(in srgb,var(--accent-red) 10%,transparent); border-radius:8px;">${L.message}</div>`,w.disabled=!1,w.textContent="Submit Request"}})),requestAnimationFrame(()=>{var p;return(p=document.getElementById("booking-page"))==null?void 0:p.classList.replace("page-enter","page-active")})}const Z=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],Be={breakfast:[["Poori Chole","Matter Kulcha","Kachori Bhaji","Dosa Sambar","Pav Bhaji","Macaroni","Aloo Paratha"],["Chacos","Idli Sambar","Daliya","Chana Chaat","Corn Flakes","Idli Sambar","Cut Fruits"],["Egg","Banana","Egg","—","Egg","—","—"],["Tea / Coffee","Tea / Coffee","Tea / Coffee","Tea / Coffee","Tea / Coffee","Tea / Coffee","Tea / Coffee"],["Bread & Jam","Bread & Jam","Bread & Jam","Bread & Jam","Bread & Jam","Bread & Jam","Bread & Jam"]],lunch:[["Green Salad","Green Salad","Green Salad","Green Salad","Green Salad","Green Salad","Green Salad"],["Boondi Raita","Mix Veg Raita","Lauki Raita","Mix Veg Raita","Boondi Raita","Mix Veg Raita","Mint Raita"],["A / P / C","A / P / C","A / P / C","A / P / C","A / P / C","A / P / C","A / P / C"],["Mix Dal Tadka","Chole Masala","Kadi Pakora","Lobhiya / Masoor Dal","Rajma Masala","Dal Makhani","Dal Tadka"],["Matar Paneer","Aloo Nutrela","Mixed Vegetable","Paneer Do Pyaza","Handi Kofta Curry","Aloo Gobhi Masala","Chap Masala"],["Aloo Palak","Boiled Rice","Soya Chap Gravy","Boiled Rice","Boiled Rice","Boiled Rice","Veg Biryani"],["Boiled Rice","Chapathi","Jeera Rice","Cut Fruits","Chapathi","Chapathi","Chapathi"],["Chapathi","Ice Cream","Chapathi","Chapathi","—","Besan Barfi","Fruit Custard"]],hitea:[["Tea / Coffee","Tea / Coffee","Tea / Coffee","Tea / Coffee","Tea / Coffee","Tea / Coffee","Tea / Coffee"],["Veg Hakka Noodles","Bhaji Pakora","Veg Sandwich","Bread Pakora","Cake Slice","Potato Wedges","Aloo Sandwich"]],dinner:[["Green Salad","Green Salad","Green Salad","Green Salad","Green Salad","Green Salad","Green Salad"],["Dal Bukhara","Curd","Rajma Masala","Curd","Dal Palak","Khichdi","Curd"],["Veg Jalfrezi","Arhar Dal Fry","Palak Paneer","Mix Dal Tadka","Soya Matar Masala","Mix Vegetable","Dal Dhaba"],["Jeera Pulao","Crispy Veg Sweet Chilly","Onion Pulao","Aloo Chole","Tomato Rice","Chapati","Paneer Lababdar"],["Chapathi","Aloo Jeera","Chapathi","Masala Rice","Chapathi","Hot Milk","Jeera Pulao"],["Milk","Soya Biryani","Milk","Chapathi","Milk","—","Chapathi"],["Rice Kheer","Chapathi","Fruit Custard","Milk","Boondi","—","Milk"]]},Se=[{key:"breakfast",label:"Breakfast",time:"7:30 – 9:30 AM"},{key:"lunch",label:"Lunch",time:"12:30 – 2:30 PM"},{key:"hitea",label:"Evening Hi-Tea",time:"5:00 – 6:30 PM"},{key:"dinner",label:"Dinner",time:"7:30 – 9:30 PM"}];function Le(){const t=new Date().getDay();return t===0?6:t-1}function _e(){const t=new Date().getHours();return t<10?"breakfast":t<15?"lunch":t<19?"hitea":"dinner"}async function Me(t){t.innerHTML='<div class="page-loading">Loading…</div>';let a=[];try{a=await E.get("/resources")}catch{}Ie(t,a)}function Ie(t,a){const r=Le();let c=_e(),s=r;if(t.innerHTML=`
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
          ${Se.map(l=>`
            <button data-meal="${l.key}" class="res-meal-tab${l.key===c?" active":""}">
              <span class="res-meal-name">${l.label}</span>
              <span class="res-meal-time">${l.time}</span>
            </button>
          `).join("")}
        </div>

        <!-- Day selector -->
        <div style="display:flex; gap:var(--space-2); margin-bottom:var(--space-5); flex-wrap:wrap;" id="day-tabs">
          ${Z.map((l,d)=>`
            <button class="res-day-tab${d===s?" active":""}" data-day="${d}">
              ${l.slice(0,3)}${d===r?" ·":""}
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
              ${[["Monday","Boys Hostel (Senior MBBS)"],["Wednesday","Girls Hostel (Senior MBBS)"]].map(([l,d])=>`<div class="res-laundry-row"><span>${l}</span><span>${d}</span></div>`).join("")}
            </div>
            <div>
              <div class="res-info-place" style="margin-bottom:var(--space-4);">Delivery</div>
              ${[["Thursday","Boys Hostel (Senior MBBS)"],["Saturday","Girls Hostel (Senior MBBS)"]].map(([l,d])=>`<div class="res-laundry-row"><span>${l}</span><span>${d}</span></div>`).join("")}
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
          <div id="contacts-body">${Ae(a)}</div>
        </section>
      `:""}

    </div>
  `,!document.getElementById("res-styles")){const l=document.createElement("style");l.id="res-styles",l.textContent=`
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
    `,document.head.appendChild(l)}function o(){const l=Be[c],d=document.getElementById("menu-panel");d&&(d.innerHTML=`
      <table>
        <thead>
          <tr>
            ${Z.map((v,e)=>`<th class="${e===s?"today":""}">${v}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${l.map(v=>`
            <tr>
              ${v.map((e,m)=>`<td class="${m===s?"today":""}">${e}</td>`).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    `)}document.getElementById("meal-tabs").querySelectorAll(".res-meal-tab").forEach(l=>{l.addEventListener("click",()=>{document.getElementById("meal-tabs").querySelectorAll(".res-meal-tab").forEach(d=>d.classList.remove("active")),l.classList.add("active"),c=l.dataset.meal,o()})}),document.getElementById("day-tabs").querySelectorAll(".res-day-tab").forEach(l=>{l.addEventListener("click",()=>{document.getElementById("day-tabs").querySelectorAll(".res-day-tab").forEach(d=>d.classList.remove("active")),l.classList.add("active"),s=+l.dataset.day,o()})}),o(),requestAnimationFrame(()=>{var l;return(l=document.getElementById("res-page"))==null?void 0:l.classList.replace("page-enter","page-active")})}function j(t,a){return`
    <div class="res-big-card">
      <div class="res-card-title">${t}</div>
      ${a}
    </div>
  `}function Ae(t){const a=["Authority","Electrician","Plumber","WiFi","Other"],r={Authority:"Authority",Electrician:"Electrician",Plumber:"Plumber",WiFi:"Wi-Fi / IT",Other:"Other"},c={};return t.forEach(o=>{(c[o.category]=c[o.category]||[]).push(o)}),`<div class="res-dir">${[...a.filter(o=>c[o]),...Object.keys(c).filter(o=>!a.includes(o))].map(o=>`
    <div class="res-dir-group">
      <div class="res-dir-cat">${r[o]||o}</div>
      ${c[o].map(l=>`
        <div class="res-dir-row">
          <div>
            <div class="res-dir-name">${l.name}</div>
            ${l.notes?`<div class="res-dir-note">${l.notes}</div>`:""}
          </div>
          <div class="res-dir-contacts">
            ${l.phone?`<a class="res-dir-phone" href="tel:${l.phone}">${l.phone}</a>`:""}
            ${l.email?`<a class="res-dir-email" href="mailto:${l.email}">${l.email}</a>`:""}
          </div>
        </div>
      `).join("")}
    </div>
  `).join("")}</div>`}const G="ahcms_hostel_filter";function J(){return localStorage.getItem(G)||""}function de(t){t?localStorage.setItem(G,t):localStorage.removeItem(G),window.dispatchEvent(new CustomEvent("hostel-change",{detail:t}))}function K(t){window.addEventListener("hostel-change",a=>t(a.detail))}async function Te(t){let a=[];async function r(){t.innerHTML='<div class="page-loading">Loading</div>';try{const s=J(),o=s?`?hostel=${encodeURIComponent(s)}`:"",[l,d]=await Promise.all([E.get(`/dashboard/admin${o}`),E.get("/rooms")]);a=[...new Set(d.map(v=>v.hostel))].sort(),c(t,l,a,s)}catch(s){t.innerHTML=`<div class="page-error">Failed to load: ${s.message}</div>`}}K(()=>r()),await r();function c(s,{stats:o,recentComplaints:l,wardens:d,wardenOfficePhone:v},e,m){const n=d.filter(g=>g.role==="Warden"),h=d.filter(g=>g.role==="Guard"),S=o.totalCapacity>0?Math.round(o.totalOccupied/o.totalCapacity*100):0;s.innerHTML=`
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
              ${e.map(g=>`<option value="${g}" ${g===m?"selected":""}>${qe(g)}</option>`).join("")}
            </select>
          </div>
        </div>

        <!-- Stat Cards -->
        <div class="card-grid">
          <div class="card card-accent-blue">
            <div class="card-label">Total Rooms</div>
            <div class="card-value">${o.totalRooms}</div>
            <div class="card-sub">${o.vacantRooms} vacant · ${S}% utilized</div>
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
              ${v?`
                <a href="tel:${v}" style="
                  display:inline-flex; align-items:center; gap:6px;
                  background:color-mix(in srgb,var(--accent-green) 12%,transparent);
                  border:1px solid color-mix(in srgb,var(--accent-green) 30%,transparent);
                  color:var(--accent-green); font-size:var(--text-xs); font-weight:600;
                  letter-spacing:.04em; padding:4px 10px; border-radius:999px;
                  text-decoration:none; transition:background .15s;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Office: ${v}
                </a>`:""}
            </div>
            ${n.length===0?'<p class="empty-msg">No warden data available.</p>':n.map(g=>`
              <div class="contact-row" style="align-items:flex-start;">
                <div class="contact-avatar">${g.name[0]}</div>
                <div class="contact-info" style="flex:1;">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:2px;">
                    <div class="contact-name">${g.name}</div>
                    <a href="tel:${g.phone}" class="contact-phone" style="margin-left:auto;">${g.phone||""}</a>
                  </div>
                  <div class="contact-meta">${g.hostel} · ${g.email||""}</div>
                  <div style="display:flex; flex-wrap:wrap; gap:12px; font-size:11px; margin-top:8px; padding-top:8px; border-top:1px solid var(--border-subtle); color:var(--text-secondary);">
                    <span><span style="font-weight:600; color:var(--text-tertiary);">Last:</span> ${g.previous?g.previous.name:"Unknown"}</span>
                    <span style="color:var(--accent-green);"><span style="font-weight:600;">Current:</span> Active</span>
                    <span><span style="font-weight:600; color:var(--text-tertiary);">Next:</span> ${g.next?g.next.name:"Unknown"}</span>
                  </div>
                </div>
              </div>
            `).join("")}
            <div class="form-section-title" style="margin-top:var(--space-5);">On-Duty Guards</div>
            ${h.length===0?'<p class="empty-msg">No guard data.</p>':h.map(g=>`
              <div class="contact-row">
                <div class="contact-avatar guard">${g.name[0]}</div>
                <div class="contact-info">
                  <div class="contact-name">${g.name}</div>
                  <div class="contact-meta">${g.hostel} · ${g.shift} shift</div>
                </div>
                <a href="tel:${g.phone}" class="contact-phone">${g.phone||""}</a>
              </div>
            `).join("")}
          </div>

          <!-- Recent Complaints -->
          <div class="form-section" style="max-width:none;">
            <div class="form-section-title">Recent Complaints</div>
            ${l.length===0?'<p class="empty-msg">No recent complaints.</p>':`
            <div class="activity-list">
              ${l.map(g=>`
                  <div class="activity-item">
                    <div class="activity-dot" style="background:${g.status==="open"?"var(--accent-amber)":g.status==="in-progress"?"var(--accent-blue)":"var(--accent-green)"}"></div>
                    <div class="activity-content">
                      <div class="activity-text">
                        <strong>${g.student_name||g.student_id}</strong> · ${g.category}
                        <span class="badge badge-${g.status}">${g.status}</span>
                      </div>
                      <div class="activity-time">${g.date} · ${g.room_id||""}</div>
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
              <div class="occ-track-inner" style="width:${S}%"></div>
            </div>
            <span style="font-size:var(--text-sm); color:var(--text-secondary);">${o.totalOccupied} / ${o.totalCapacity} beds · ${S}%</span>
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
    `,document.getElementById("hostel-filter").addEventListener("change",g=>{de(g.target.value),r()}),s.querySelectorAll('a.link-accent[href^="#"]').forEach(g=>{g.addEventListener("click",y=>{y.preventDefault(),window.location.hash=g.getAttribute("href").slice(1)})}),requestAnimationFrame(()=>{var g;return(g=document.getElementById("admin-home"))==null?void 0:g.classList.replace("page-enter","page-active")})}}function qe(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const q=t=>`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;opacity:.6;vertical-align:middle;">${t}</svg>`,ze={Plumbing:q('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),Electricity:q('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'),WiFi:q('<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>'),Cleanliness:q('<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'),Carpentry:q('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),Other:q('<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>')},ee=["open","in-progress","resolved"],Re=["Plumbing","Electricity","WiFi","Cleanliness","Carpentry","Other"];async function He(t){async function a(){t.innerHTML='<div class="page-loading">Loading…</div>';try{const r=J(),c=r?`?hostel=${encodeURIComponent(r)}`:"",s=await E.get(`/complaints${c}`);Pe(t,s,a)}catch(r){t.innerHTML=`<div class="page-error">Failed to load: ${r.message}</div>`}}K(()=>a()),await a()}function Pe(t,a,r){let c=a,s="all",o="",l=null;t.innerHTML=`
    <div class="page-enter" id="admin-complaints-page">
      <div class="page-header">
        <h2>Complaints Management</h2>
        <p>Review, approve, and update status of all hostel complaints.</p>
      </div>

      <!-- Summary chips -->
      <div class="card-grid" style="margin-bottom: var(--space-6);">
        <div class="card" style="text-align:center; cursor:pointer;" data-quick="all">
          <div class="card-label">Total</div>
          <div class="card-value" style="font-size:var(--text-2xl);">${c.length}</div>
        </div>
        ${ee.map(e=>{const m=c.filter(h=>h.status===e).length;return`<div class="card card-accent-${e==="open"?"amber":e==="in-progress"?"blue":"green"}" style="text-align:center; cursor:pointer;" data-quick="${e}">
            <div class="card-label">${e}</div>
            <div class="card-value" style="font-size:var(--text-2xl);">${m}</div>
          </div>`}).join("")}
      </div>

      <div class="table-container">
        <div class="table-toolbar">
          <div class="table-toolbar-title">All Complaints</div>
          <div style="display:flex; gap: var(--space-2); flex-wrap: wrap; align-items: center;">
            <select class="form-select" id="cat-filter" style="width: auto; padding: 4px 28px 4px 10px; font-size: var(--text-xs);">
              <option value="">All Categories</option>
              ${Re.map(e=>`<option value="${e}">${e}</option>`).join("")}
            </select>
            <button class="filter-chip active" data-status="all">All</button>
            ${ee.map(e=>`<button class="filter-chip" data-status="${e}">${e}</button>`).join("")}
          </div>
        </div>
        <div id="complaints-body"></div>
      </div>
    </div>
  `;function d(){let e=c;return o&&(e=e.filter(m=>m.category===o)),s!=="all"&&(e=e.filter(m=>m.status===s)),e}function v(){const e=d(),m=document.getElementById("complaints-body");if(e.length===0){m.innerHTML='<p style="padding:var(--space-8); text-align:center; color:var(--text-tertiary);">No complaints match the current filter.</p>';return}m.innerHTML=`
      <table>
        <thead>
          <tr>
            <th>#</th><th>Student</th><th>Room</th><th>Category</th>
            <th>Description</th><th>Date</th><th>Status</th><th>Action</th>
          </tr>
        </thead>
        <tbody id="cmp-tbody">
          ${e.map(n=>`
            <tr class="cmp-row${l===n.complaint_id?" expanded-row":""}" data-id="${n.complaint_id}">
              <td class="cell-mono">${n.complaint_id}</td>
              <td><div>${n.student_name||n.student_id}</div><div style="font-size:var(--text-xs); color:var(--text-tertiary);">${n.roll_no||""}</div></td>
              <td class="cell-mono">${n.room_id||"—"}</td>
              <td><span style="display:inline-flex;align-items:center;gap:5px;">${ze[n.category]||""} ${n.category}</span></td>
              <td style="max-width:180px; overflow:hidden; text-overflow:ellipsis;" title="${n.description}">${n.description.slice(0,45)}${n.description.length>45?"…":""}</td>
              <td class="cell-mono">
                <div>${n.date}</div>
                ${n.resolved_date?`<div style="font-size:10px; color:var(--accent-green); margin-top:2px;">Res: ${n.resolved_date}</div>`:""}
              </td>
              <td><span class="badge badge-${n.status}">${n.status}</span></td>
              <td>
                ${n.status!=="resolved"?`
                  <div style="display:flex; gap:4px;">
                    ${n.status==="open"?`<button class="btn btn-sm btn-secondary" data-action="in-progress" data-id="${n.complaint_id}">Start</button>`:""}
                    <button class="btn btn-sm btn-primary" data-action="resolved" data-id="${n.complaint_id}">Resolve</button>
                  </div>
                `:'<span style="color:var(--text-tertiary); font-size:var(--text-xs);">Done</span>'}
              </td>
            </tr>
            ${n.photo_base64?`
              <tr class="photo-row" data-for="${n.complaint_id}" style="${l===n.complaint_id?"":"display:none"}">
                <td colspan="8" style="padding: var(--space-3) var(--space-6); background: var(--bg-elevated);">
                  <img src="${n.photo_base64}" alt="Complaint photo" style="max-width:280px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);" />
                  ${n.admin_note?`<p style="font-size:var(--text-xs); color:var(--text-secondary); margin-top: var(--space-2);">Note: ${n.admin_note}</p>`:""}
                </td>
              </tr>
            `:""}
          `).join("")}
        </tbody>
      </table>
    `,m.querySelectorAll("[data-action]").forEach(n=>{n.addEventListener("click",async()=>{const h=+n.dataset.id,S=n.dataset.action;n.disabled=!0;try{const g=await E.patch(`/complaints/${h}/status`,{status:S});c=c.map(y=>y.complaint_id===h?{...y,...g}:y),B(`Complaint #${h} → ${S}`,"success"),v()}catch(g){B(g.message,"error"),n.disabled=!1}})}),m.querySelectorAll(".cmp-row").forEach(n=>{n.addEventListener("click",()=>{const h=+n.dataset.id;l=l===h?null:h,v()})})}t.querySelectorAll("[data-status]").forEach(e=>{e.addEventListener("click",()=>{t.querySelectorAll("[data-status]").forEach(m=>m.classList.remove("active")),e.classList.add("active"),s=e.dataset.status,v()})}),t.querySelectorAll("[data-quick]").forEach(e=>{e.addEventListener("click",()=>{var m;s=e.dataset.quick,t.querySelectorAll("[data-status]").forEach(n=>n.classList.remove("active")),(m=t.querySelector(`[data-status="${s}"]`))==null||m.classList.add("active"),v()})}),document.getElementById("cat-filter").addEventListener("change",e=>{o=e.target.value,v()}),v(),requestAnimationFrame(()=>{var e;return(e=document.getElementById("admin-complaints-page"))==null?void 0:e.classList.replace("page-enter","page-active")})}const M=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),je=["Senior MBBS boys hostel","Senior MBBS girls hostel"],V={"M-MBBS":{hostel:"Senior MBBS boys hostel",floor:8},"M-B.Tech":{hostel:"Senior MBBS boys hostel",floor:9},"F-MBBS":{hostel:"Senior MBBS girls hostel",floor:7},"F-B.Tech":{hostel:"Senior MBBS girls hostel",floor:8}};function te(t,a,r){const c=a&&r?`${a}-${r}`:null,s=c?V[c]:null;return t.filter(o=>{if(o.current_occupancy>=o.capacity)return!1;if(!s){const l=a==="M"?"boys":a==="F"?"girls":"";return l?o.hostel.toLowerCase().includes(l):!0}return o.hostel===s.hostel&&o.floor===s.floor}).sort((o,l)=>o.room_id.localeCompare(l.room_id))}function ae(t){return`<option value="${t.room_id}">${t.room_id} · Fl ${t.floor} · ${t.type} · ${t.current_occupancy}/${t.capacity}</option>`}async function De(t){async function a(){t.innerHTML='<div class="page-loading">Loading…</div>';try{const[r,c,s,o,l]=await Promise.all([E.get("/rooms"),E.get("/rooms/booking-requests"),E.get("/rooms/change-requests"),E.get("/rooms/allocations"),E.get("/students")]);Fe(t,{rooms:r,bookReqs:c,changeReqs:s,allocs:o,students:l},a)}catch(r){t.innerHTML=`<div class="page-error">Failed to load: ${r.message}</div>`}}K(()=>a()),await a()}function Fe(t,a,r){const{rooms:c,bookReqs:s,changeReqs:o,students:l}=a;let d="grid",v=J();const e=s.filter(y=>y.status==="pending").length+o.filter(y=>y.status==="pending").length;t.innerHTML=`
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
            ${je.map(y=>`<option value="${y}" ${y===v?"selected":""}>${y}</option>`).join("")}
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
  `,document.getElementById("rm-hostel-filter").addEventListener("change",y=>{v=y.target.value,de(v),m()}),document.querySelectorAll("#rm-tabs button").forEach(y=>{y.addEventListener("click",()=>{d=y.dataset.tab,document.querySelectorAll("#rm-tabs button").forEach(x=>x.classList.toggle("active",x.dataset.tab===d)),["grid","student","pending","history"].forEach(x=>{document.getElementById(`rm-panel-${x}`).style.display=x===d?"":"none"}),m()})});function m(){d==="grid"&&n(),d==="student"&&h(),d==="pending"&&S(),d==="history"&&g()}function n(){const y=v?c.filter(u=>u.hostel===v):c,x={};y.forEach(u=>{(x[u.hostel]=x[u.hostel]||{})[u.floor]=(x[u.hostel][u.floor]||[]).concat(u)});const f=y.filter(u=>u.current_occupancy===0).length,k=y.filter(u=>u.current_occupancy>0&&u.current_occupancy<u.capacity).length,i=y.filter(u=>u.current_occupancy>=u.capacity).length,$=u=>{const w=u.capacity>0?u.current_occupancy/u.capacity:0;return`<div class="room-cell ${w===0?"vacant":w<1?"partial":"full"}" title="${u.room_id} — ${u.type} ${u.current_occupancy}/${u.capacity}">
        <div class="rc-id">${u.room_id}</div>
        <div style="font-size:9px;opacity:.5;">${u.current_occupancy}/${u.capacity}</div>
      </div>`};let p=`<div style="display:flex;gap:var(--space-5);margin-bottom:var(--space-5);">
      <span style="display:flex;align-items:center;gap:6px;font-size:var(--text-xs);color:var(--text-secondary);"><span class="legend-dot" style="background:var(--accent-green);"></span>Vacant (${f})</span>
      <span style="display:flex;align-items:center;gap:6px;font-size:var(--text-xs);color:var(--text-secondary);"><span class="legend-dot" style="background:var(--accent-amber);"></span>Partial (${k})</span>
      <span style="display:flex;align-items:center;gap:6px;font-size:var(--text-xs);color:var(--text-secondary);"><span class="legend-dot" style="background:var(--accent-red);"></span>Full (${i})</span>
    </div>`;for(const u of Object.keys(x).sort()){p+=`<div style="font-size:var(--text-sm);font-weight:600;margin:var(--space-6) 0 var(--space-3);padding-bottom:var(--space-2);border-bottom:1px solid var(--border-subtle);">${u}</div>`;for(const w of Object.keys(x[u]).sort((b,L)=>+b-+L)){const b=x[u][w].sort((I,P)=>I.room_id.localeCompare(P.room_id)),L=b.slice(0,5),C=b.slice(5,10);p+=`<div class="floor-label">Floor ${w}</div>
          <div class="floor-corridor">
            <div class="corridor-row">${L.map($).join("")}</div>
            <div class="corridor-strip"><div class="corridor-strip-line"></div><div class="corridor-strip-label">corridor</div><div class="corridor-strip-line"></div></div>
            <div class="corridor-row">${C.map($).join("")}</div>
          </div>`}}y.length||(p+='<p style="padding:var(--space-8);text-align:center;color:var(--text-tertiary);">No rooms.</p>'),document.getElementById("rm-panel-grid").innerHTML=p}function h(){const y=document.getElementById("rm-panel-student");y.innerHTML=`
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
            Students (${l.length})
          </div>
          <div id="quick-alloc-msg"></div>
          <div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-bottom:var(--space-3);">Unallocated · click  Assign to allocate a room</div>
          <div style="display:flex;flex-direction:column;gap:var(--space-3);" id="student-quick-list">
            ${l.map(f=>`
              <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3) var(--space-4);background:var(--bg-elevated);border-radius:var(--radius-md);border:1px solid var(--border-subtle);gap:var(--space-3);">
                <div>
                  <div style="font-size:var(--text-sm);font-weight:500;">${M(f.name)}</div>
                  <div style="font-size:var(--text-xs);color:var(--text-tertiary);">${f.roll_no} · ${f.gender==="M"?"Male":"Female"} · ${f.course} Yr ${f.year}</div>
                </div>
                <div style="display:flex;align-items:center;gap:var(--space-3);flex-shrink:0;">
                  ${f.alloc_room?`<span class="cell-mono" style="font-size:var(--text-xs);color:var(--accent-green);">${f.alloc_room}</span>`:`<select class="form-select" style="padding:4px 8px;font-size:var(--text-xs);min-width:130px;" data-stu="${f.student_id}" data-gender="${f.gender}" id="qs-room-${f.student_id}">
                        <option value="">— room —</option>
                        ${te(c,f.gender,f.course).map(ae).join("")}
                      </select>
                      <button class="btn btn-sm btn-primary" data-assign="${f.student_id}" style="white-space:nowrap;">Assign</button>`}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `,document.getElementById("also-alloc").addEventListener("change",f=>{document.getElementById("alloc-room-wrap").style.display=f.target.checked?"":"none",x()}),document.getElementById("add-gender").addEventListener("change",x),document.getElementById("add-course").addEventListener("change",f=>{const k=f.target.value==="MBBS"?5:f.target.value==="B.Tech"?4:0,i=document.getElementById("add-year");i.innerHTML=k?'<option value="">Select</option>'+Array.from({length:k},($,p)=>`<option value="${p+1}">Year ${p+1}</option>`).join(""):'<option value="">Select course first</option>',x()});function x(){const f=document.getElementById("add-gender").value,k=document.getElementById("add-course").value,i=te(c,f,k),$=document.getElementById("alloc-room-select"),p=V[`${f}-${k}`]?`Floor ${V[`${f}-${k}`].floor} rooms`:"rooms";$.innerHTML=i.length?`<option value="">— pick a room (${p}) —</option>${i.map(ae).join("")}`:`<option value="">No vacant ${p}</option>`}y.querySelectorAll("[data-assign]").forEach(f=>{f.addEventListener("click",async()=>{const k=f.dataset.assign,i=document.getElementById(`qs-room-${k}`),$=i==null?void 0:i.value;if(!$){B("Select a room first.","error");return}f.disabled=!0,f.textContent="…";try{await E.post("/rooms/direct-allocate",{student_id:k,room_id:$}),B("Room assigned!","success"),await r()}catch(p){B(p.message,"error"),f.disabled=!1,f.textContent="Assign"}})}),document.getElementById("add-form").addEventListener("submit",async f=>{f.preventDefault();const k=new FormData(f.target),i=Object.fromEntries(k.entries());i.hostel=i.gender==="M"?"Senior MBBS boys hostel":i.gender==="F"?"Senior MBBS girls hostel":"";const $=document.getElementById("add-btn"),p=document.getElementById("add-msg");$.disabled=!0,$.textContent="Registering…",p.innerHTML="";try{const u=await E.post("/students",i);document.getElementById("also-alloc").checked&&i.alloc_room&&await E.post("/rooms/direct-allocate",{student_id:u.student_id,room_id:i.alloc_room}),p.innerHTML=`<div style="background:color-mix(in srgb,var(--accent-green) 10%,transparent);border:1px solid color-mix(in srgb,var(--accent-green) 25%,transparent);border-radius:8px;padding:var(--space-3) var(--space-4);font-size:var(--text-sm);color:var(--accent-green);margin-bottom:var(--space-4);">
          ✓ ${u.name} registered. ID: <strong>${u.student_id}</strong> · Login: <strong>${u.default_password}</strong>
        </div>`,f.target.reset(),document.getElementById("alloc-room-wrap").style.display="none",await r()}catch(u){p.innerHTML=`<div style="background:color-mix(in srgb,var(--accent-red) 10%,transparent);border:1px solid color-mix(in srgb,var(--accent-red) 25%,transparent);border-radius:8px;padding:var(--space-3) var(--space-4);font-size:var(--text-sm);color:var(--accent-red);margin-bottom:var(--space-4);">${u.message}</div>`,$.disabled=!1,$.textContent="Register Student"}})}function S(){const y=document.getElementById("rm-panel-pending"),x=s.filter(i=>i.status==="pending"),f=o.filter(i=>i.status==="pending");if(!x.length&&!f.length){y.innerHTML='<p style="padding:var(--space-10);text-align:center;color:var(--text-tertiary);">No pending requests. All clear.</p>';return}let k="";x.length&&(k+=`<div style="font-size:var(--text-xs);font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-tertiary);margin-bottom:var(--space-4);">Booking Requests (${x.length})</div>
      <div style="display:flex;flex-direction:column;gap:var(--space-3);margin-bottom:var(--space-8);">
        ${x.map(i=>{var $;return`
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-3);padding:var(--space-4) var(--space-5);background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:var(--radius-md);">
            <div>
              <div style="font-weight:500;font-size:var(--text-sm);">${M(i.student_name)} <span style="font-size:var(--text-xs);color:var(--text-tertiary);font-weight:400;">· ${i.roll_no}</span></div>
              <div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:2px;">Room <strong style="color:var(--text-secondary);">${i.room_id}</strong> · ${M(i.room_hostel||i.hostel)} · Floor ${i.floor} · ${i.type} · ${i.current_occupancy}/${i.capacity}</div>
              ${i.preferences?`<div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:2px;">Pref: ${M(i.preferences)}</div>`:""}
              <div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:2px;">${($=i.created_at)==null?void 0:$.slice(0,10)}</div>
            </div>
            <div style="display:flex;gap:var(--space-2);">
              <button class="btn btn-sm btn-primary" data-breq="${i.request_id}" data-action="approved">Approve</button>
              <button class="btn btn-sm btn-secondary" style="color:var(--accent-red);" data-breq="${i.request_id}" data-action="rejected">Reject</button>
            </div>
          </div>`}).join("")}
      </div>`),f.length&&(k+=`<div style="font-size:var(--text-xs);font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-tertiary);margin-bottom:var(--space-4);">Room Change Requests (${f.length})</div>
      <div style="display:flex;flex-direction:column;gap:var(--space-3);">
        ${f.map(i=>{var $;return`
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-3);padding:var(--space-4) var(--space-5);background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:var(--radius-md);">
            <div>
              <div style="font-weight:500;font-size:var(--text-sm);">${M(i.student_name)} <span style="font-size:var(--text-xs);color:var(--text-tertiary);font-weight:400;">· ${i.roll_no}</span></div>
              <div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:2px;"><strong style="color:var(--text-secondary);">${i.from_room_id}</strong> → <strong style="color:var(--text-secondary);">${i.to_room_id}</strong> · ${M(i.to_hostel)} · Fl ${i.to_floor} · ${i.to_occupancy}/${i.to_capacity}</div>
              <div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:2px;">Reason: ${M(i.reason)}</div>
              <div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:2px;">${($=i.created_at)==null?void 0:$.slice(0,10)}</div>
            </div>
            <div style="display:flex;gap:var(--space-2);">
              <button class="btn btn-sm btn-primary" data-creq="${i.change_id}" data-action="approved">Approve</button>
              <button class="btn btn-sm btn-secondary" style="color:var(--accent-red);" data-creq="${i.change_id}" data-action="rejected">Reject</button>
            </div>
          </div>`}).join("")}
      </div>`),y.innerHTML=k,y.querySelectorAll("[data-breq]").forEach(i=>{i.addEventListener("click",async()=>{i.disabled=!0;try{await E.patch(`/rooms/booking-requests/${i.dataset.breq}`,{status:i.dataset.action}),B(`Request ${i.dataset.action}.`,"success"),await r()}catch($){B($.message,"error"),i.disabled=!1}})}),y.querySelectorAll("[data-creq]").forEach(i=>{i.addEventListener("click",async()=>{i.disabled=!0;try{await E.patch(`/rooms/change-requests/${i.dataset.creq}`,{status:i.dataset.action}),B(`Room change ${i.dataset.action}.`,"success"),await r()}catch($){B($.message,"error"),i.disabled=!1}})})}function g(){const y=document.getElementById("rm-panel-history"),x=v?s.filter(i=>i.room_hostel===v||i.hostel===v):s,f=v?o.filter(i=>i.from_hostel===v||i.to_hostel===v):o,k=[...x.map(i=>({type:"booking",...i})),...f.map(i=>({type:"change",...i}))].sort((i,$)=>($.created_at||"").localeCompare(i.created_at||""));if(!k.length){y.innerHTML='<p style="padding:var(--space-10);text-align:center;color:var(--text-tertiary);">No requests yet.</p>';return}y.innerHTML=`
      <div class="table-container">
        <table>
          <thead><tr><th>Type</th><th>Student</th><th>Details</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            ${k.map(i=>{var u;const $=i.type==="booking"?`Room ${i.room_id} · ${M(i.room_hostel||i.hostel)} · Fl ${i.floor}`:`${i.from_room_id} → ${i.to_room_id} · ${M(i.to_hostel)}`,p=i.status==="pending"?"open":i.status==="approved"?"in-progress":"resolved";return`<tr>
                <td style="font-size:var(--text-xs);color:var(--text-tertiary);">${i.type==="booking"?"Booking":"Transfer"}</td>
                <td><div style="font-weight:500;font-size:var(--text-sm);">${M(i.student_name)}</div><div style="font-size:var(--text-xs);color:var(--text-tertiary);">${i.roll_no}</div></td>
                <td style="font-size:var(--text-xs);">${$}</td>
                <td><span class="badge badge-${p}">${i.status}</span></td>
                <td class="cell-mono">${(u=i.created_at)==null?void 0:u.slice(0,10)}</td>
              </tr>`}).join("")}
          </tbody>
        </table>
      </div>`}n(),requestAnimationFrame(()=>{var y;return(y=document.getElementById("admin-rooms-page"))==null?void 0:y.classList.replace("page-enter","page-active")})}const oe=["Plumber","Electrician","WiFi","Authority","Other"],A=(t,a="")=>`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;opacity:.65;" ${a}>${t}</svg>`,Oe={Plumber:A('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),Electrician:A('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'),WiFi:A('<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>'),Authority:A('<line x1="3" y1="22" x2="21" y2="22"/><rect x="2" y="11" width="20" height="11" rx="1"/><polygon points="12 2 2 7 22 7"/><line x1="12" y1="7" x2="12" y2="11"/><rect x="9" y="15" width="6" height="7" rx="1"/>'),Other:A('<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>')},Ne=A('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>'),Ge=A('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>');async function Ve(t){t.innerHTML='<div class="page-loading">Loading…</div>';try{const a=await E.get("/resources");Ue(t,a)}catch(a){t.innerHTML=`<div class="page-error">Failed to load: ${a.message}</div>`}}function Ue(t,a){let r=a,c="",s=null;t.innerHTML=`
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
                ${oe.map(d=>`<option value="${d}">${d}</option>`).join("")}
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
              ${oe.map(d=>`<option value="${d}">${d}</option>`).join("")}
            </select>
          </div>
        </div>
        <div id="resources-body"></div>
      </div>
    </div>
  `;function o(){const d=c?r.filter(m=>m.category===c):r,v=document.getElementById("resources-body");if(d.length===0){v.innerHTML='<p style="padding:var(--space-8); text-align:center; color:var(--text-tertiary);">No contacts in this category.</p>';return}const e={};d.forEach(m=>{e[m.category]||(e[m.category]=[]),e[m.category].push(m)}),v.innerHTML=Object.entries(e).map(([m,n])=>`
      <div style="padding: var(--space-4) var(--space-6);">
        <div style="display:flex; align-items:center; gap:6px; font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--text-tertiary); margin-bottom: var(--space-3);">
          ${Oe[m]||""} ${m}
        </div>
        ${n.map(h=>`
          <div class="contact-row" style="margin-bottom: var(--space-2);">
            <div class="contact-avatar">${h.name[0].toUpperCase()}</div>
            <div class="contact-info" style="flex:1;">
              <div class="contact-name">${h.name}</div>
              <div class="contact-meta" style="display:flex; flex-wrap:wrap; align-items:center; gap:var(--space-4);">
                ${h.phone?`<span style="display:inline-flex;align-items:center;gap:4px;">${Ne}<a href="tel:${h.phone}" style="color:inherit;">${h.phone}</a></span>`:""}
                ${h.email?`<span style="display:inline-flex;align-items:center;gap:4px;">${Ge}<a href="mailto:${h.email}" style="color:inherit;">${h.email}</a></span>`:""}
              </div>
              ${h.notes?`<div style="font-size:var(--text-xs); color:var(--text-tertiary); margin-top:2px;">${h.notes}</div>`:""}
            </div>
            <div style="display:flex; gap:4px; flex-shrink:0;">
              <button class="btn btn-sm btn-secondary" data-edit="${h.resource_id}">Edit</button>
              <button class="btn btn-sm btn-secondary" data-delete="${h.resource_id}" style="color:var(--accent-red);">Del</button>
            </div>
          </div>
        `).join("")}
        <hr style="border:none; border-top: 1px solid var(--border-subtle); margin: var(--space-3) 0;" />
      </div>
    `).join(""),v.querySelectorAll("[data-edit]").forEach(m=>{m.addEventListener("click",()=>{const n=r.find(h=>h.resource_id===+m.dataset.edit);n&&(s=n.resource_id,document.getElementById("res-cat").value=n.category,document.getElementById("res-name").value=n.name,document.getElementById("res-phone").value=n.phone||"",document.getElementById("res-email").value=n.email||"",document.getElementById("res-notes").value=n.notes||"",document.getElementById("resource-form-title").textContent="Edit Contact",document.getElementById("btn-res-submit").textContent="Save Changes",document.getElementById("btn-res-cancel").style.display="",document.getElementById("resource-form").scrollIntoView({behavior:"smooth"}))})}),v.querySelectorAll("[data-delete]").forEach(m=>{m.addEventListener("click",async()=>{if(confirm("Delete this contact?")){m.disabled=!0;try{await E.delete(`/resources/${m.dataset.delete}`),r=r.filter(n=>n.resource_id!==+m.dataset.delete),B("Contact deleted.","success"),o()}catch(n){B(n.message,"error"),m.disabled=!1}}})})}document.getElementById("cat-filter-select").addEventListener("change",d=>{c=d.target.value,o()}),document.getElementById("btn-res-cancel").addEventListener("click",()=>{s=null,document.getElementById("resource-form").reset(),document.getElementById("resource-form-title").textContent="Add New Contact",document.getElementById("btn-res-submit").textContent="Add Contact",document.getElementById("btn-res-cancel").style.display="none"});const l=document.getElementById("resource-form");l.addEventListener("submit",async d=>{d.preventDefault(),t.querySelectorAll(".form-error").forEach(S=>S.classList.remove("visible"));let v=!0;const e=document.getElementById("res-cat").value,m=document.getElementById("res-name").value.trim();if(e||(document.getElementById("err-res-cat").classList.add("visible"),v=!1),m||(document.getElementById("err-res-name").classList.add("visible"),v=!1),!v)return;const n={category:e,name:m,phone:document.getElementById("res-phone").value.trim()||null,email:document.getElementById("res-email").value.trim()||null,notes:document.getElementById("res-notes").value.trim()||null},h=document.getElementById("btn-res-submit");h.disabled=!0;try{if(s){const S=await E.put(`/resources/${s}`,n);r=r.map(g=>g.resource_id===s?S:g),B("Contact updated.","success"),document.getElementById("btn-res-cancel").click()}else r=[await E.post("/resources",n),...r],B("Contact added.","success"),l.reset();o()}catch(S){B(S.message,"error")}finally{h.disabled=!1}}),o(),requestAnimationFrame(()=>{var d;return(d=document.getElementById("resources-page"))==null?void 0:d.classList.replace("page-enter","page-active")})}const We={home:he,complaints:Ee,booking:N,resources:Me},Ye={home:Te,complaints:He,rooms:De,resources:Ve};let z="home",U=null;function W(){return ne()==="admin"?Ye:We}function D(t){const a=W();a[t]||(t="home"),z=t,window.location.hash=t;const r=document.getElementById("sidebar"),c=document.getElementById("main-content");ge(r,z,D),a[t](c,()=>D(z)),U&&U.close()}function re(){document.body.innerHTML=`
    <div id="app">
      <aside id="sidebar" class="sidebar"></aside>
      <main id="main-content" class="main"></main>
    </div>
  `}function Je(){if(!pe()){be(()=>{re(),se()});return}re(),se()}function se(){U=ue();const t=window.location.hash.replace("#","");z=W()[t]?t:"home",D(z),window.addEventListener("hashchange",()=>{const r=window.location.hash.replace("#","");W()[r]&&r!==z&&D(r)})}(function(){const t=localStorage.getItem("ahcms_theme")||"light";document.documentElement.setAttribute("data-theme",t)})();Je();
