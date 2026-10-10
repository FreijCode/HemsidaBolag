from pathlib import Path
import re,base64
root=Path('dist')
def data(path,mime):return 'data:'+mime+';base64,'+base64.b64encode(path.read_bytes()).decode()
html=(root/'index.html').read_text()
def css(m):
    path=root/m.group(1).lstrip('/')
    text=path.read_text()
    text=re.sub(r'url\(([^)]+)\)',lambda x:'url('+data(root/x.group(1).strip('"\'').lstrip('/'),'font/woff2')+')' if '.woff2' in x.group(1) else x.group(0),text)
    return '<style>'+text+'</style>'
html=re.sub(r'<link[^>]*href="([^"]+\.css)"[^>]*>',css,html)
html=re.sub(r'<script[^>]*src="([^"]+)"[^>]*></script>',lambda m:'<script>'+ (root/m.group(1).lstrip('/')).read_text()+'</script>',html)
html=re.sub(r'src="(/[^"]+\.jpg)"',lambda m:'src="'+data(root/m.group(1).lstrip('/'),'image/jpeg')+'"',html)
html=re.sub(r' srcset="[^"]+"', '', html)
html=re.sub(r'src="(/[^"]+\.webp)"',lambda m:'src="'+data(root/m.group(1).lstrip('/'),'image/webp')+'"',html)
Path('freijventure-demo.html').write_text(html)
