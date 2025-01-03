#include<bits/stdc++.h>
using namespace std;

int main()
{
    vector<string> char1;
    vector<string> str;
    char1.emplace_back("A");
    char1.emplace_back("L");
    char1.emplace_back("P");
    int n;
    cin>>n;
        for(int i=0;i<=n;i++)
        {
            for(int j=i;j<=n;j++)
            {
                string a=char1[i];
                string b=char1[j];
                str.emplace_back(a+b);
            }
            for(int j=n-1;j>=i;j--)
            {
                string a=char1[i];
                string b=char1[j];
                str.emplace_back(a+b);
            }
        }
    for(auto it:str)
    {
        cout<<it<<" ";
    }
}