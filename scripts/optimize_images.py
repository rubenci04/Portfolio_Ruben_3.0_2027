from PIL import Image
from pathlib import Path
for path in [Path('src/assets/profile.png'), *Path('src/assets/cards_images').glob('*.png')]:
    im=Image.open(path)
    im.thumbnail((960,1184))
    dest=path.with_suffix('.webp')
    im.save(dest,'WEBP',quality=86,method=6)
    print(path.name, im.size, dest.stat().st_size)
