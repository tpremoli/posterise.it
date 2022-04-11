from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import update_or_create_user_tokens, is_spotify_authenticated, get_user_tokens, execute_spotify_api_request

# API Auth
class AuthURL(APIView):
    def get(self, request, format=None):
        scopes = 'user-top-read'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)

# API Auth
def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(
        request.session.session_key, access_token, token_type, expires_in, refresh_token)

    return redirect('/create-polaroid')

# API auth
class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(
            self.request.session.session_key
        )
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)

# Executes spotify api requests
class Polaroidize(APIView):
    def get(self, request, format=None, **kwargs):
        is_authenticated = is_spotify_authenticated(
            self.request.session.session_key
        )

        if(is_authenticated):
            endpoint = request.GET.get('type') + "/" + request.GET.get('id')

            response = execute_spotify_api_request(
                self.request.session.session_key, endpoint, post_=False, put_=False)

            # Probably not best practice
            if "error" in response:
                statuscode = {
                    "status": response["error"]["status"], "errorMsg": response["error"]["message"]}
                response.update(statuscode)
                return Response(response, status=status.HTTP_404_NOT_FOUND)

            statuscode = {"status": 200}
            response.update(statuscode)
            return Response(response, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
