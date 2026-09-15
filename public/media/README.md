# Watch & Buy reel

Drop your vertical reel video here as:

```
public/media/watch-reel.mp4
```

Recommended: 9:16, muted-friendly (autoplay), under ~15MB.

Until a file exists, the phone screen cycles product photos.

## 3D model note

Your upload was a Blender `.blend` (not web-ready). The scene uses a Three.js phone built with your extracted textures from that pack. To swap in the exact mesh later, export from Blender as `public/models/iphone.glb` and we can load it with `useGLTF`.
