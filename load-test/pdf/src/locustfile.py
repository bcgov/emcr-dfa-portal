from locust import HttpUser, task, between

# GetPDF_DFATest

class User(HttpUser):
    @task
    def post_pdf(self):
        headers = { 'content-type': 'application/json' }
        response = self.client.post("/api/pdf/GetPDF_DFATest", headers=headers)
        
        # Optionally, check that the response status is 200
        assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
        
        # You can also print response details for debugging
        # print(response.text)
