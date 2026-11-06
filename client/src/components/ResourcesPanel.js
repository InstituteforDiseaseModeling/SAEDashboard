import React from 'react';

const st = {
  details: {
    marginTop: 8,
    border: '1px solid #ccc',
    borderRadius: 4,
    fontSize: '0.78rem',
    backgroundColor: '#f5f5f5',
  },
  summary: {
    padding: '4px 10px',
    cursor: 'pointer',
    fontWeight: 600,
    color: '#313A44',
    userSelect: 'none',
  },
  section: {padding: '2px 10px 6px'},
  sectionLabel: {fontWeight: 600, fontSize: '0.72rem', color: '#888', textTransform: 'uppercase', margin: '4px 0 2px'},
  ul: {margin: 0, paddingLeft: 16, listStyle: 'disc'},
  ulNested: {margin: 0, paddingLeft: 16, listStyle: 'circle'},
  li: {marginBottom: 2, color: '#313A44', lineHeight: 1.4},
  clickable: {cursor: 'pointer', color: '#1565c0', textDecoration: 'underline'},
  code: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    padding: '1px 4px',
    borderRadius: 3,
    fontSize: '0.76rem',
    fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
  },
};

const dedup = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = JSON.stringify(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const ResourcesPanel = ({resources, sessionId, onPreviewFile, onPreviewDoc}) => {
  if (!resources) return null;
  const {tools_used = [], scripts = [], files = [], doc_sources = []} = resources;
  const dataFiles = dedup(files.filter((f) => !/\.(png|jpe?g|gif|svg)$/i.test(f)));
  const uniqueDocSources = dedup(doc_sources);

  // Merge execute_python tools with their corresponding scripts.
  // Each execute_python tool at index i corresponds to scripts[i].
  const pyTools = tools_used.filter((t) => t.name === 'execute_python');
  const otherTools = dedup(tools_used.filter((t) => t.name !== 'execute_python'));
  const mergedScripts = [];
  let scriptIdx = 0;
  for (const t of pyTools) {
    const scriptPath = scriptIdx < scripts.length ? scripts[scriptIdx] : null;
    const key = `${t.description}|${scriptPath || ''}`;
    if (!mergedScripts.some((m) => `${m.description}|${m.scriptPath || ''}` === key)) {
      mergedScripts.push({description: t.description, scriptPath});
    }
    scriptIdx++;
  }
  // Orphan scripts without a matching tool entry
  for (; scriptIdx < scripts.length; scriptIdx++) {
    const sp = scripts[scriptIdx];
    if (!mergedScripts.some((m) => m.scriptPath === sp)) {
      mergedScripts.push({description: sp.split('/').pop(), scriptPath: sp});
    }
  }

  // Group doc sources by document
  const docGroups = [];
  const docMap = {};
  for (const d of uniqueDocSources) {
    const key = `${d.doc_title}|${d.year || ''}|${d.md_file || ''}`;
    if (!docMap[key]) {
      docMap[key] = {doc_title: d.doc_title, year: d.year, source_type: d.source_type, md_file: d.md_file, sections: []};
      docGroups.push(docMap[key]);
    }
    docMap[key].sections.push({section_title: d.section_title, pages: d.pages});
  }

  const total = otherTools.length + mergedScripts.length + dataFiles.length + docGroups.length;

  return (
    <details style={st.details}>
      <summary style={st.summary}>Resources ({total || 'LLM direct response'})</summary>
      <div style={st.section}>
        {total === 0 && (
          <div style={{...st.li, fontStyle: 'italic', color: '#888', padding: '2px 0'}}>LLM direct response — no tools used</div>
        )}
        {otherTools.length > 0 && (
          <>
            <div style={st.sectionLabel}>Tools Used</div>
            <ul style={st.ul}>
              {otherTools.map((t, i) => (
                <li key={i} style={st.li}>
                  <code style={st.code}>{t.name}</code> &mdash; {t.description}
                </li>
              ))}
            </ul>
          </>
        )}
        {mergedScripts.length > 0 && (
          <>
            <div style={st.sectionLabel}>Scripts</div>
            <ul style={st.ul}>
              {mergedScripts.map((m, i) => (
                <li key={i} style={st.li}>
                  <code style={st.code}>execute_python</code> &mdash;{' '}
                  {m.scriptPath ? (
                    <span style={st.clickable} onClick={() => onPreviewFile && onPreviewFile(m.scriptPath)}>
                      {m.description}
                    </span>
                  ) : m.description}
                </li>
              ))}
            </ul>
          </>
        )}
        {dataFiles.length > 0 && (
          <>
            <div style={st.sectionLabel}>Output Files</div>
            <ul style={st.ul}>
              {dataFiles.map((path, i) => (
                <li key={i} style={st.li}>
                  <a href={`/mind/files/${path}`} download style={st.clickable}>{path.split('/').pop()}</a>
                </li>
              ))}
            </ul>
          </>
        )}
        {docGroups.length > 0 && (
          <>
            <div style={st.sectionLabel}>Document References</div>
            <ul style={st.ul}>
              {docGroups.map((doc, i) => (
                <li key={i} style={st.li}>
                  {doc.md_file ? (
                    <span style={st.clickable}
                      onClick={() => onPreviewDoc && onPreviewDoc(doc.md_file, doc.doc_title)}>
                      {doc.doc_title}{doc.year ? ` (${doc.year})` : ''}
                    </span>
                  ) : (
                    <span>{doc.doc_title}{doc.year ? ` (${doc.year})` : ''}</span>
                  )}
                  {doc.sections.length > 0 && (
                    <ul style={st.ulNested}>
                      {doc.sections.map((sec, j) => (
                        <li key={j} style={st.li}>{sec.section_title}, pp. {sec.pages}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </details>
  );
};

export default ResourcesPanel;
