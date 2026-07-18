/* Loads site-data.json and fills in every element that declares data-field,
   plus builds the committee grids dynamically. This is what lets the admin
   panel (Decap CMS) change real content without anyone touching HTML. */

function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}

function avatarLetter(name) {
  const trimmed = (name || '').trim();
  return trimmed ? trimmed[0] : '?';
}

function renderCommitteeGrid(containerId, members) {
  const container = document.getElementById(containerId);
  if (!container || !Array.isArray(members)) return;
  container.innerHTML = members.map(m => `
    <div class="member tilt-card">
      <div class="avatar">${avatarLetter(m.name)}</div>
      <h3>${m.name}</h3>
      <p>${m.role}</p>
    </div>
  `).join('');
}

function renderGalleryGrid(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container || !Array.isArray(items)) return;
  container.innerHTML = items.map(item => {
    if (item.image) {
      return `<div style="background-image:url('${item.image}'); background-size:cover; background-position:center;">
        <span style="background:rgba(0,0,0,0.45); padding:4px 10px; border-radius:4px;">${item.caption || ''}</span>
      </div>`;
    }
    return `<div>${item.caption || ''}</div>`;
  }).join('');
}

function renderBloodDonors(containerId, donors) {
  const tbody = document.getElementById(containerId);
  if (!tbody || !Array.isArray(donors)) return;
  if (donors.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="4">এখনো কোনো রক্তদাতা যোগ করা হয়নি।</td></tr>`;
    return;
  }
  tbody.innerHTML = donors.map(d => `
    <tr data-group="${d.blood_group || ''}" data-area="${(d.area || '').trim()}">
      <td>${d.name || ''}</td>
      <td><span class="badge">${d.blood_group || ''}</span></td>
      <td>${d.phone || ''}</td>
      <td>${d.area || ''}</td>
    </tr>
  `).join('');
}

function renderFinance(containerId, rows) {
  const container = document.getElementById(containerId);
  if (!container || !Array.isArray(rows)) return;
  container.innerHTML = rows.map(r => `
    <div class="report-card tilt-card">
      <span class="yr">${r.year || ''}</span>
      <div class="line"><span>মোট আয়</span><b>${r.income || ''}</b></div>
      <div class="line"><span>মোট ব্যয়</span><b>${r.expense || ''}</b></div>
      <p style="margin-top:14px; font-size:14px; color:#6b5a62;">${r.note || ''}</p>
    </div>
  `).join('');
}

function renderNews(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container || !Array.isArray(items)) return;
  if (items.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:#9a8878;">এখনো কোনো সংবাদ যোগ করা হয়নি।</p>`;
    return;
  }
  container.innerHTML = items.map(n => `
    <div class="news-item">
      <span class="news-date">${n.date || ''}</span>
      <h3>${n.title || ''}</h3>
      <p>${n.body || ''}</p>
    </div>
  `).join('');
}

fetch('site-data.json')
  .then(res => res.json())
  .then(data => {
    document.querySelectorAll('[data-field]').forEach(el => {
      const value = getPath(data, el.getAttribute('data-field'));
      if (value !== undefined) el.textContent = value;
    });

    if (data.committee) {
      renderCommitteeGrid('executive-committee-grid', data.committee.executive);
      renderCommitteeGrid('advisory-committee-grid', data.committee.advisory);
    }

    if (data.gallery) {
      renderGalleryGrid('full-gallery-grid', data.gallery);
      renderGalleryGrid('home-gallery-grid', data.gallery.slice(0, 5));
    }

    if (data.blood_donors) {
      renderBloodDonors('blood-donor-table-body', data.blood_donors);
      window.__bloodDonors = data.blood_donors;
      if (typeof window.onBloodDonorsLoaded === 'function') window.onBloodDonorsLoaded();
    }

    if (data.finance) {
      renderFinance('finance-report-grid', data.finance);
    }

    if (data.news) {
      renderNews('news-list-container', data.news);
    }

    if (data.memorial) {
      const letterEl = document.getElementById('memorialPhotoLetter');
      if (letterEl) letterEl.textContent = avatarLetter(data.memorial.name);
    }
  })
  .catch(err => console.error('site-data.json load failed:', err));
