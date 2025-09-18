from fastapi import FastAPI, Request, Form, Cookie, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

app = FastAPI()
templates = Jinja2Templates(directory="templates")

class Comment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    author: str
    created_at: datetime = Field(default_factory=datetime.now)

class BlogPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    author: str
    created_at: datetime = Field(default_factory=datetime.now)
    comments: List[Comment] = []

class PostCreate(BaseModel):
    title: str
    content: str

class CommentCreate(BaseModel):
    content: str

class SignInForm(BaseModel):
    username: str

# In-memory storage for blog posts
blog_posts: List[BlogPost] = []

@app.get("/", response_class=HTMLResponse)
async def home(request: Request, user: Optional[str] = Cookie(None)):
    return templates.TemplateResponse("index.html", {
        "request": request, 
        "user": user, 
        "posts": blog_posts
    })

@app.post("/signin")
async def signin(username: str = Form(...)):
    response = RedirectResponse(url="/", status_code=302)
    response.set_cookie(key="user", value=username)
    return response

@app.post("/signout")
async def signout():
    response = RedirectResponse(url="/", status_code=302)
    response.delete_cookie(key="user")
    return response

@app.post("/create-post")
async def create_post(
    title: str = Form(...), 
    content: str = Form(...), 
    user: Optional[str] = Cookie(None)
):
    if not user:
        raise HTTPException(status_code=401, detail="Must be signed in to create posts")
    
    post = BlogPost(title=title, content=content, author=user)
    blog_posts.append(post)
    return RedirectResponse(url="/", status_code=302)

@app.post("/create-comment")
async def create_comment(
    post_id: str = Form(...), 
    content: str = Form(...), 
    user: Optional[str] = Cookie(None)
):
    if not user:
        raise HTTPException(status_code=401, detail="Must be signed in to create comments")
    
    post = next((p for p in blog_posts if p.id == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    post.comments.append(Comment(content=content, author=user))
    return RedirectResponse(url="/", status_code=302)

@app.get("/post/{post_id}", response_class=HTMLResponse)
async def view_post(request: Request, post_id: str, user: Optional[str] = Cookie(None)):
    post = next((p for p in blog_posts if p.id == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return templates.TemplateResponse("post_detail.html", {
        "request": request,
        "user": user,
        "post": post
    })